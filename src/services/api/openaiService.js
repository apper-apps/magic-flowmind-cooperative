import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async generateResponse(messages, model = 'gpt-3.5-turbo') {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
      }

      const response = await this.client.chat.completions.create({
        model: model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      });

      return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your configuration.');
      } else if (error.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      } else if (error.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again.');
      } else if (error.message.includes('API key not configured')) {
        throw error;
      } else {
        throw new Error('Failed to connect to OpenAI. Please check your internet connection.');
      }
    }
  }

  async generateStreamResponse(messages, model = 'gpt-3.5-turbo', onChunk) {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
      }

      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 1000,
        temperature: 0.7,
        stream: true
      });

      let fullContent = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          onChunk(content, fullContent);
        }
      }

      return fullContent;
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      throw error;
    }
  }

  getAvailableModels() {
    return [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
      { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Latest GPT-4 with improved performance' }
    ];
  }
}

export default new OpenAIService();