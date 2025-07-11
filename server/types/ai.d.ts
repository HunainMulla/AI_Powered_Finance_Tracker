declare module 'together-ai' {
  export default class Together {
    constructor(config?: { apiKey?: string });
    chat: {
      completions: {
        create(params: {
          messages: Array<{ role: string; content: string }>;
          model: string;
          temperature?: number;
          max_tokens?: number;
        }): Promise<{
          choices: Array<{
            message: {
              content: string;
              role: string;
            };
          }>;
        }>;
      };
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOGETHER_API_KEY: string;
    }
  }
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
}
