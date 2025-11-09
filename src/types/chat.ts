export interface AIResponse {
  message: string;
  success: boolean;
  error?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}