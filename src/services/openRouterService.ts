
// OpenRouter API service for enhancing CoachClara with AI capabilities

const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

export const generateAIResponse = async (
  userMessage: string, 
  userName: string, 
  previousMessages: OpenRouterMessage[] = []
): Promise<string> => {
  try {
    console.log("OpenRouter API - Generating response for:", userName);
    
    // Create system message for Clara's persona
    const systemMessage: OpenRouterMessage = {
      role: "system",
      content: `You are Clara, a friendly AI coach focused on wellness, career growth, and personal development for women. 
      Your tone is encouraging, empathetic, and positive. You offer practical advice and emotional support.
      You're speaking with ${userName}. Use emojis naturally to express emotions and add warmth to your responses.
      Keep responses concise but helpful, around 2-3 sentences.`
    };
    
    // Create user message
    const userMessageObj: OpenRouterMessage = {
      role: "user",
      content: userMessage
    };
    
    // Combine all messages (limited to last 10 for context)
    const messages = [
      systemMessage,
      ...previousMessages.slice(-10),
      userMessageObj
    ];
    
    console.log("Sending request to OpenRouter with messages:", messages.length);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Make API call to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "CoachClara"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages,
        temperature: 0.7,
        max_tokens: 300
      }),
      signal: controller.signal
    });
    
    // Clear timeout after request completes
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("OpenRouter API error status:", response.status);
      console.error("OpenRouter API error details:", errorData);
      
      if (response.status === 429) {
        return "I've reached my limit for conversations right now. Please try again in a few moments! 🙂";
      }
      
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as OpenRouterResponse;
    return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Check if it's an abort error (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      return "Our connection timed out. Please check your internet connection and try again.";
    }
    
    return "I'm experiencing some technical difficulties. Please check your internet connection and try again in a moment! 🙂";
  }
};

// Converts our message format to OpenRouter format
export const formatMessagesForOpenRouter = (messages: any[]): OpenRouterMessage[] => {
  return messages.map(msg => ({
    role: msg.sender === 'clara' ? 'assistant' : 'user',
    content: msg.text
  }));
};
