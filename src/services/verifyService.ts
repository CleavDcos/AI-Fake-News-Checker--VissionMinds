import api from './api';

export interface VerifyRequest {
  text?: string;
  url?: string;
}

export interface VerifyResponse {
  _id: string;
  userId?: string;
  text: string;
  url?: string;
  result: 'true' | 'uncertain' | 'false';
  confidence: number;
  explanation: string;
  sources?: string[];
  createdAt: string;
}

export interface HistoryItem extends VerifyResponse {
  score?: number;
}

export interface FeedbackRequest {
  verificationId: string;
  feedback: 'helpful' | 'not_helpful';
  comment?: string;
}

export interface CommunityPost extends VerifyResponse {
  upvotes: number;
  downvotes: number;
  comments: Array<{
    _id: string;
    userId: string;
    username: string;
    text: string;
    createdAt: string;
  }>;
}

// Verify news article
export const verifyNews = async (data: VerifyRequest): Promise<VerifyResponse> => {
  try {
    const response = await api.post('/verify', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify news');
  }
};

// Get user verification history
export const getHistory = async (userId: string): Promise<HistoryItem[]> => {
  try {
    const response = await api.get(`/verify/history/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch history');
  }
};

// Send feedback on verification
export const sendFeedback = async (data: FeedbackRequest): Promise<void> => {
  try {
    await api.post('/verify/feedback', data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send feedback');
  }
};

// Get community posts
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  try {
    const response = await api.get('/verify/community');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch community posts');
  }
};

// Upvote a verification
export const upvoteVerification = async (verificationId: string): Promise<void> => {
  try {
    await api.post(`/verify/${verificationId}/upvote`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upvote');
  }
};

// Downvote a verification
export const downvoteVerification = async (verificationId: string): Promise<void> => {
  try {
    await api.post(`/verify/${verificationId}/downvote`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to downvote');
  }
};

// Add comment to verification
export const addComment = async (verificationId: string, text: string): Promise<void> => {
  try {
    await api.post(`/verify/${verificationId}/comment`, { text });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add comment');
  }
};
