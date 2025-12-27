/**
 * API Types matching backend Pydantic schemas
 * Generated from backend schemas in app/schemas/
 */

// ============================================
// Common Types
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  error?: string;
  code?: string;
}

// ============================================
// User Types (app/schemas/user.py)
// ============================================

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

// ============================================
// Token Types (app/schemas/token.py)
// ============================================

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ============================================
// Paper Types (app/schemas/paper.py)
// ============================================

export interface Paper {
  id: string;
  title: string;
  abstract: string | null;
  arxiv_id: string | null;
  published_date: string | null;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaperListParams {
  search?: string;
  arxiv_id?: string;
  author_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface PaginatedPaperResponse {
  items: Paper[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ============================================
// Note Types (app/schemas/note.py)
// ============================================

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  paper_id: string | null;
  title: string;
  content: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title: string;
  content: string;
  paper_id?: string;
  tags?: string[];
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  paper_id?: string;
  tags?: string[];
}

export interface NoteListParams {
  search?: string;
  paper_id?: string;
  tag_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

// ============================================
// Favorite Types (app/schemas/favorite.py)
// ============================================

export interface Favorite {
  id: string;
  user_id: string;
  target_id: string;
  favorite_type: string;
  created_at: string;
}

export interface FavoriteStatusResponse {
  is_favorited: boolean;
  favorite_count: number;
}

// ============================================
// Activity Types (app/schemas/activity.py)
// ============================================

export interface Activity {
  id: string;
  user_id: string;
  user: User;
  content: string;
  activity_type: string;
  reference_note_id: string | null;
  reference_paper_id: string | null;
  created_at: string;
  updated_at: string;
  comments_count: number;
}

export interface ActivityCreate {
  content: string;
  activity_type?: string;
  reference_note_id?: string;
  reference_paper_id?: string;
}

export interface ActivityUpdate {
  content?: string;
}

export interface ActivityWithComments extends Activity {
  comments: Comment[];
}

export interface ActivityListParams {
  user_id?: string;
  activity_type?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

// ============================================
// Comment Types (app/schemas/comment.py)
// ============================================

export interface Comment {
  id: string;
  activity_id: string;
  user_id: string;
  user: User;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  replies: Comment[];
}

export interface CommentCreate {
  content: string;
  parent_id?: string;
}

export interface CommentUpdate {
  content?: string;
}

// ============================================
// Chat Types (app/schemas/chat.py)
// ============================================

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  stream?: boolean;
  system_prompt?: string;
}

export interface ChatResponse {
  conversation_id: string;
  message_id: string;
  response: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface ConversationListItem {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Recommendation Types (app/schemas/recommendation.py)
// ============================================

export interface Recommendation {
  paper_id: string;
  title: string;
  abstract: string | null;
  arxiv_id: string | null;
  score: number;
  reason: string | null;
  created_at: string;
}

export interface RecommendationListResponse {
  recommendations: Recommendation[];
  total: number;
  last_updated: string | null;
}

export interface RecommendationStatusResponse {
  user_id: string;
  has_recommendations: boolean;
  recommendation_count: number;
  last_updated: string | null;
  favorite_count: number;
  message: string;
}

// ============================================
// AI Summary Types
// ============================================

export interface SummaryRequest {
  paper_id: string;
}

export interface SummaryResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary: string | null;
  error: string | null;
}

export interface SummarySyncRequest {
  paper_id: string;
}

export interface SummarySyncResponse {
  summary: string;
  paper_id: string;
  created_at: string;
}

// ============================================
// System Types
// ============================================

export interface HealthResponse {
  status: string;
  timestamp: string;
  version?: string;
}

// ============================================
// Auth Context Types
// ============================================

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLoginRequest) => Promise<void>;
  register: (data: UserRegisterRequest) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}
