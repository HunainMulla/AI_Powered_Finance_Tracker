const Together = require('together-ai');

class AIService {
  constructor() {
    if (!process.env.TOGETHER_API_KEY) {
      console.error('AI Service Error: TOGETHER_API_KEY is not set');
      throw new Error('AI service is not properly configured');
    }

    this.together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });
    this.model = 'deepseek-ai/DeepSeek-V3';
  }

  async chat(messages) {
    try {
      console.log('AI Service - Starting chat with messages:', JSON.stringify(messages, null, 2));
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error('Messages array is required and cannot be empty');
      }

      console.log('AI Service - Sending request to Together.ai API');
      const response = await this.together.chat.completions.create({
        messages,
        model: this.model,
        temperature: 0.7,
        max_tokens: 500,
      }).catch(err => {
        console.error('AI Service - API Error:', err);
        if (err.response) {
          console.error('API Response Error:', {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          });
        }
        throw err;
      });

      console.log('AI Service - Received response:', JSON.stringify(response, null, 2));
      
      const content = response.choices[0]?.message?.content?.trim();
      
      if (!content) {
        console.error('AI Service - Empty content in response');
        throw new Error('No content in AI response');
      }

      return {
        success: true,
        message: content,
      };
    } catch (error) {
      console.error('AI Service - Error details:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        env: {
          TOGETHER_API_KEY: process.env.TOGETHER_API_KEY ? '***' : 'NOT SET',
          NODE_ENV: process.env.NODE_ENV
        }
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get response from AI service',
      };
    }
  }

  async getFinancialAdvice(context) {
    if (!context || typeof context !== 'string') {
      return {
        success: false,
        message: 'Context is required and must be a string',
      };
    }

    const prompt = `You are a knowledgeable and friendly financial advisor. 
      Provide clear, concise, and actionable financial advice based on this context: 
      ${context}
      
      Keep the response professional but approachable, and limit it to 3-5 key points.`;

    return this.chat([{
      role: 'user',
      content: prompt,
    }]);
  }
}

// Create and export a singleton instance
const aiService = new AIService();
module.exports = { AIService, aiService };
