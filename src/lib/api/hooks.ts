/**
 * React Query Hooks
 * Provides typed hooks for all API operations with caching and invalidation
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { apiService as api } from './services';
import type {
  // Types
  Paper,
  Note,
  Activity,
  Comment,
  Conversation,
  ConversationListItem,
  Recommendation,
  PaginatedPaperResponse,
  PaginatedResponse,

  // Request types
  NoteCreate,
  NoteUpdate,
  ActivityCreate,
  ActivityUpdate,
  CommentCreate,
  CommentUpdate,
  ChatRequest,
} from './types';

// ============================================
// Query Keys
// ============================================

export const queryKeys = {
  // Auth
  currentUser: ['auth', 'user'] as const,

  // Papers
  papers: (params?: unknown) => ['papers', params] as const,
  paper: (id: string) => ['paper', id] as const,
  paperByArxiv: (arxivId: string) => ['paper', 'arxiv', arxivId] as const,
  paperFavoriteStatus: (id: string) => ['paper', id, 'favorite'] as const,
  paperSearch: (query: string, limit: number) => ['papers', 'search', query, limit] as const,

  // Notes
  notes: (params?: unknown) => ['notes', params] as const,
  note: (id: string) => ['note', id] as const,

  // Activities
  activities: (params?: unknown) => ['activities', params] as const,
  activity: (id: string) => ['activity', id] as const,
  activityComments: (id: string) => ['activity', id, 'comments'] as const,

  // Conversations
  conversations: ['conversations'] as const,
  conversation: (id: string) => ['conversation', id] as const,

  // Recommendations
  recommendations: (limit: number) => ['recommendations', limit] as const,
  recommendationStatus: ['recommendations', 'status'] as const,

  // System
  health: ['system', 'health'] as const,
} as const;

// ============================================
// Auth Hooks
// ============================================

export function useCurrentUser(
  options?: Omit<UseQueryOptions<unknown, Error, typeof api.auth.getCurrentUser>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: api.auth.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// ============================================
// Paper Hooks
// ============================================

export function usePapers(
  params?: {
    search?: string;
    arxiv_id?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    page_size?: number;
  },
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedPaperResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.papers(params),
    queryFn: () => api.paper.list(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

export function usePaper(
  paperId: string,
  options?: Omit<UseQueryOptions<unknown, Error, Paper>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.paper(paperId),
    queryFn: () => api.paper.getById(paperId),
    enabled: !!paperId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function usePaperByArxiv(
  arxivId: string,
  options?: Omit<UseQueryOptions<unknown, Error, Paper>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.paperByArxiv(arxivId),
    queryFn: () => api.paper.getByArxivId(arxivId),
    enabled: !!arxivId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function usePaperFavoriteStatus(
  paperId: string,
  options?: Omit<UseQueryOptions<unknown, Error, { is_favorited: boolean; favorite_count: number }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.paperFavoriteStatus(paperId),
    queryFn: () => api.paper.getFavoriteStatus(paperId),
    enabled: !!paperId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paperId: string) => api.paper.addFavorite(paperId),
    onSuccess: (_, paperId) => {
      // Invalidate favorite status
      queryClient.invalidateQueries({ queryKey: queryKeys.paperFavoriteStatus(paperId) });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paperId: string) => api.paper.removeFavorite(paperId),
    onSuccess: (_, paperId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paperFavoriteStatus(paperId) });
    },
  });
}

export function useToggleFavorite(paperId: string, isFavorited: boolean) {
  const addFavorite = useAddToFavorites();
  const removeFavorite = useRemoveFromFavorites();

  return useMutation({
    mutationFn: () => {
      return isFavorited
        ? removeFavorite.mutateAsync(paperId)
        : addFavorite.mutateAsync(paperId);
    },
  });
}

// ============================================
// Note Hooks
// ============================================

export function useNotes(
  params?: {
    search?: string;
    paper_id?: string;
    tag_id?: string;
    page?: number;
    page_size?: number;
  },
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedResponse<Note>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.notes(params),
    queryFn: () => api.note.list(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useNote(
  noteId: string,
  options?: Omit<UseQueryOptions<unknown, Error, Note>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.note(noteId),
    queryFn: () => api.note.getById(noteId),
    enabled: !!noteId,
    ...options,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteCreate) => api.note.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes() });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: NoteUpdate }) =>
      api.note.update(noteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.note(variables.noteId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notes() });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => api.note.delete(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes() });
    },
  });
}

// ============================================
// Activity Hooks
// ============================================

export function useActivities(
  params?: {
    user_id?: string;
    activity_type?: string;
    page?: number;
    page_size?: number;
  },
  options?: Omit<UseQueryOptions<unknown, Error, PaginatedResponse<Activity>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.activities(params),
    queryFn: () => api.activity.list(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
}

export function useActivity(
  activityId: string,
  options?: Omit<UseQueryOptions<unknown, Error, Activity>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.activity(activityId),
    queryFn: () => api.activity.getById(activityId),
    enabled: !!activityId,
    ...options,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityCreate) => api.activity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, data }: { activityId: string; data: ActivityUpdate }) =>
      api.activity.update(activityId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity(variables.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) => api.activity.delete(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities() });
    },
  });
}

// ============================================
// Comment Hooks
// ============================================

export function useActivityComments(
  activityId: string,
  options?: Omit<UseQueryOptions<unknown, Error, Comment[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.activityComments(activityId),
    queryFn: () => api.activity.getComments(activityId),
    enabled: !!activityId,
    ...options,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activityId,
      content,
      parentId,
    }: {
      activityId: string;
      content: string;
      parentId?: string;
    }) => api.activity.addComment(activityId, content, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityComments(variables.activityId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activity(variables.activityId),
      });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: CommentUpdate }) =>
      api.comment.update(commentId, data),
    onSuccess: () => {
      // Invalidate all activity comments queries
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => api.comment.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

// ============================================
// AI Hooks
// ============================================

export function useConversations(
  options?: Omit<UseQueryOptions<unknown, Error, ConversationListItem[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => api.ai.listConversations(),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

export function useConversation(
  conversationId: string,
  options?: Omit<UseQueryOptions<unknown, Error, Conversation>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.conversation(conversationId),
    queryFn: () => api.ai.getConversation(conversationId),
    enabled: !!conversationId,
    ...options,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => api.ai.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

// ============================================
// Recommendation Hooks
// ============================================

export function useRecommendations(
  limit: number = 10,
  options?: Omit<UseQueryOptions<unknown, Error, { recommendations: Recommendation[]; total: number; last_updated: string | null }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.recommendations(limit),
    queryFn: () => api.recommendation.getPapers(limit),
    staleTime: 60 * 60 * 1000, // 1 hour (updated daily)
    ...options,
  });
}

export function useRecommendationStatus(
  options?: Omit<UseQueryOptions<unknown, Error, { has_recommendations: boolean; recommendation_count: number; last_updated: string | null; favorite_count: number }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.recommendationStatus,
    queryFn: () => api.recommendation.getStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useRefreshRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.recommendation.refresh(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendations(10) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendationStatus });
    },
  });
}

// ============================================
// System Hooks
// ============================================

export function useHealth(
  options?: Omit<UseQueryOptions<unknown, Error, { status: string }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => api.system.health(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  });
}

// ============================================
// Custom hook for AI Chat Streaming
// ============================================

export function useChatStream() {
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [response, setResponse] = React.useState('');
  const [error, setError] = React.useState<Error | null>(null);

  const chat = React.useCallback(async (data: ChatRequest) => {
    setIsStreaming(true);
    setResponse('');
    setError(null);

    try {
      const abortController = new AbortController();

      await api.ai.chatStream(
        data,
        (chunk) => {
          setResponse((prev) => prev + chunk);
        },
        abortController.signal
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { chat, isStreaming, response, error };
}

import React from 'react';
