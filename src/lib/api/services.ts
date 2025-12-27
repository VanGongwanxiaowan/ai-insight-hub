/**
 * API Service Layer
 * Provides typed methods for all backend endpoints
 */

import { api, streamChat } from './client';
import type {
  // Auth
  User,
  UserRegisterRequest,
  UserLoginRequest,
  TokenResponse,
  RefreshTokenResponse,

  // Papers
  Paper,
  PaperListParams,
  PaginatedPaperResponse,
  FavoriteStatusResponse,

  // Notes
  Note,
  NoteCreate,
  NoteUpdate,
  NoteListParams,
  PaginatedResponse,

  // Activities
  Activity,
  ActivityWithComments,
  ActivityCreate,
  ActivityUpdate,
  ActivityListParams,

  // Comments
  Comment,
  CommentCreate,
  CommentUpdate,

  // AI
  ChatRequest,
  ChatResponse,
  Conversation,
  ConversationListItem,
  SummaryResponse,
  SummarySyncResponse,

  // Recommendations
  Recommendation,
  RecommendationListResponse,
  RecommendationStatusResponse,

  // System
  HealthResponse,
} from './types';

// ============================================
// Auth Service
// ============================================

export const authService = {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  async register(data: UserRegisterRequest): Promise<TokenResponse> {
    return api.post<TokenResponse>('/api/v1/auth/register', data);
  },

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  async login(data: UserLoginRequest): Promise<TokenResponse> {
    return api.post<TokenResponse>('/api/v1/auth/login', data);
  },

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return api.post<RefreshTokenResponse>('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
  },

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/api/v1/auth/me');
  },
};

// ============================================
// Paper Service
// ============================================

export const paperService = {
  /**
   * List papers with search, filter, and pagination
   * GET /api/v1/papers/
   */
  async list(params?: PaperListParams): Promise<PaginatedPaperResponse> {
    return api.get<PaginatedPaperResponse>('/api/v1/papers/', params);
  },

  /**
   * Get paper by ID
   * GET /api/v1/papers/{paper_id}
   */
  async getById(paperId: string): Promise<Paper> {
    return api.get<Paper>(`/api/v1/papers/${paperId}`);
  },

  /**
   * Get by arXiv ID
   * GET /api/v1/papers/arxiv/{arxiv_id}
   */
  async getByArxivId(arxivId: string): Promise<Paper> {
    return api.get<Paper>(`/api/v1/papers/arxiv/${arxivId}`);
  },

  /**
   * Add paper to favorites
   * POST /api/v1/papers/{paper_id}/favorite
   */
  async addFavorite(paperId: string): Promise<void> {
    return api.post<void>(`/api/v1/papers/${paperId}/favorite`);
  },

  /**
   * Remove paper from favorites
   * DELETE /api/v1/papers/{paper_id}/favorite
   */
  async removeFavorite(paperId: string): Promise<void> {
    return api.delete<void>(`/api/v1/papers/${paperId}/favorite`);
  },

  /**
   * Check favorite status
   * GET /api/v1/papers/{paper_id}/favorite/status
   */
  async getFavoriteStatus(paperId: string): Promise<FavoriteStatusResponse> {
    return api.get<FavoriteStatusResponse>(
      `/api/v1/papers/${paperId}/favorite/status`
    );
  },

  /**
   * Search papers (Elasticsearch)
   * GET /api/v1/papers/search
   */
  async search(query: string, limit: number = 20): Promise<{ papers: Paper[]; total: number }> {
    return api.get<{ papers: Paper[]; total: number }>('/api/v1/papers/search', {
      q: query,
      limit,
    });
  },
};

// ============================================
// Note Service
// ============================================

export const noteService = {
  /**
   * Create a new note
   * POST /api/v1/notes/
   */
  async create(data: NoteCreate): Promise<Note> {
    return api.post<Note>('/api/v1/notes/', data);
  },

  /**
   * List user notes
   * GET /api/v1/notes/
   */
  async list(params?: NoteListParams): Promise<PaginatedResponse<Note>> {
    return api.get<PaginatedResponse<Note>>('/api/v1/notes/', params);
  },

  /**
   * Get note by ID
   * GET /api/v1/notes/{note_id}
   */
  async getById(noteId: string): Promise<Note> {
    return api.get<Note>(`/api/v1/notes/${noteId}`);
  },

  /**
   * Update note
   * PUT /api/v1/notes/{note_id}
   */
  async update(noteId: string, data: NoteUpdate): Promise<Note> {
    return api.put<Note>(`/api/v1/notes/${noteId}`, data);
  },

  /**
   * Delete note
   * DELETE /api/v1/notes/{note_id}
   */
  async delete(noteId: string): Promise<void> {
    return api.delete<void>(`/api/v1/notes/${noteId}`);
  },
};

// ============================================
// Activity Service
// ============================================

export const activityService = {
  /**
   * Create a new activity
   * POST /api/v1/activities/
   */
  async create(data: ActivityCreate): Promise<Activity> {
    return api.post<Activity>('/api/v1/activities/', data);
  },

  /**
   * List activities
   * GET /api/v1/activities/
   */
  async list(params?: ActivityListParams): Promise<PaginatedResponse<Activity>> {
    return api.get<PaginatedResponse<Activity>>('/api/v1/activities/', params);
  },

  /**
   * Get activity by ID with comments
   * GET /api/v1/activities/{activity_id}
   */
  async getById(activityId: string): Promise<ActivityWithComments> {
    return api.get<ActivityWithComments>(`/api/v1/activities/${activityId}`);
  },

  /**
   * Update activity
   * PUT /api/v1/activities/{activity_id}
   */
  async update(activityId: string, data: ActivityUpdate): Promise<Activity> {
    return api.put<Activity>(`/api/v1/activities/${activityId}`, data);
  },

  /**
   * Delete activity
   * DELETE /api/v1/activities/{activity_id}
   */
  async delete(activityId: string): Promise<void> {
    return api.delete<void>(`/api/v1/activities/${activityId}`);
  },

  /**
   * Add comment to activity
   * POST /api/v1/activities/{activity_id}/comments
   */
  async addComment(activityId: string, content: string, parentId?: string): Promise<Comment> {
    return api.post<Comment>(`/api/v1/activities/${activityId}/comments`, {
      content,
      parent_id: parentId,
    });
  },

  /**
   * Get comments for activity
   * GET /api/v1/activities/{activity_id}/comments
   */
  async getComments(activityId: string): Promise<Comment[]> {
    return api.get<Comment[]>(`/api/v1/activities/${activityId}/comments`);
  },
};

// ============================================
// Comment Service
// ============================================

export const commentService = {
  /**
   * Update comment
   * PUT /api/v1/activities/comments/{comment_id}
   */
  async update(commentId: string, data: CommentUpdate): Promise<Comment> {
    return api.put<Comment>(`/api/v1/activities/comments/${commentId}`, data);
  },

  /**
   * Delete comment
   * DELETE /api/v1/activities/comments/{comment_id}
   */
  async delete(commentId: string): Promise<void> {
    return api.delete<void>(`/api/v1/activities/comments/${commentId}`);
  },
};

// ============================================
// AI Service
// ============================================

export const aiService = {
  /**
   * Generate paper summary (async)
   * POST /api/v1/ai/summarize
   */
  async summarize(paperId: string): Promise<SummaryResponse> {
    return api.post<SummaryResponse>('/api/v1/ai/summarize', { paper_id: paperId });
  },

  /**
   * Check summary status
   * GET /api/v1/ai/summarize/{task_id}
   */
  async getSummaryStatus(taskId: string): Promise<SummaryResponse> {
    return api.get<SummaryResponse>(`/api/v1/ai/summarize/${taskId}`);
  },

  /**
   * Generate summary (sync)
   * POST /api/v1/ai/summarize/sync
   */
  async summarizeSync(paperId: string): Promise<SummarySyncResponse> {
    return api.post<SummarySyncResponse>('/api/v1/ai/summarize/sync', {
      paper_id: paperId,
    });
  },

  /**
   * Chat with AI (non-streaming)
   * POST /api/v1/ai/chat
   */
  async chat(data: ChatRequest): Promise<ChatResponse> {
    return api.post<ChatResponse>('/api/v1/ai/chat', {
      ...data,
      stream: false,
    });
  },

  /**
   * Chat with AI (streaming)
   * POST /api/v1/ai/chat
   */
  chatStream(
    data: ChatRequest,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    return streamChat('/api/v1/ai/chat', { ...data, stream: true }, onChunk, signal);
  },

  /**
   * List conversations
   * GET /api/v1/ai/chat/conversations
   */
  async listConversations(): Promise<ConversationListItem[]> {
    return api.get<ConversationListItem[]>('/api/v1/ai/chat/conversations');
  },

  /**
   * Get conversation by ID
   * GET /api/v1/ai/chat/conversations/{conversation_id}
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    return api.get<Conversation>(`/api/v1/ai/chat/conversations/${conversationId}`);
  },

  /**
   * Delete conversation
   * DELETE /api/v1/ai/chat/conversations/{conversation_id}
   */
  async deleteConversation(conversationId: string): Promise<void> {
    return api.delete<void>(`/api/v1/ai/chat/conversations/${conversationId}`);
  },
};

// ============================================
// Recommendation Service
// ============================================

export const recommendationService = {
  /**
   * Get recommended papers
   * GET /api/v1/recommendations/papers
   */
  async getPapers(limit: number = 10): Promise<RecommendationListResponse> {
    return api.get<RecommendationListResponse>('/api/v1/recommendations/papers', {
      limit,
    });
  },

  /**
   * Refresh recommendations
   * POST /api/v1/recommendations/refresh
   */
  async refresh(): Promise<{ task_id: string; message: string; user_id: string }> {
    return api.post<{ task_id: string; message: string; user_id: string }>(
      '/api/v1/recommendations/refresh'
    );
  },

  /**
   * Get recommendation status
   * GET /api/v1/recommendations/status
   */
  async getStatus(): Promise<RecommendationStatusResponse> {
    return api.get<RecommendationStatusResponse>('/api/v1/recommendations/status');
  },
};

// ============================================
// System Service
// ============================================

export const systemService = {
  /**
   * Health check
   * GET /api/v1/system/health
   */
  async health(): Promise<HealthResponse> {
    return api.get<HealthResponse>('/api/v1/system/health');
  },
};

// ============================================
// Export all services
// ============================================

export default {
  auth: authService,
  paper: paperService,
  note: noteService,
  activity: activityService,
  comment: commentService,
  ai: aiService,
  recommendation: recommendationService,
  system: systemService,
};
