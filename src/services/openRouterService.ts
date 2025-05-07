
// OpenRouter API service for enhancing Skillher Coach with AI capabilities

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

// Maximum length for a single message before splitting
const MAX_MESSAGE_LENGTH = 250;

export const generateAIResponse = async (
  userMessage: string, 
  userName: string, 
  previousMessages: OpenRouterMessage[] = [],
  contextFocus: string = ""
): Promise<string[]> => {
  try {
    // Create system message for Skillher Coach's persona with optional context focus
    const systemMessage: OpenRouterMessage = {
      role: "system",
      content: `You are a friendly AI coach ${contextFocus || "focused on wellness, career growth, and personal development for women"}. 
      Your tone is encouraging, empathetic, and positive. You offer practical advice and emotional support.
      You're speaking with ${userName}. Use emojis naturally to express emotions and add warmth to your responses.
      Format your responses with proper paragraphing and line breaks for readability.
      Separate distinct ideas into different paragraphs.
      Keep responses concise but helpful, typically 2-4 sentences per paragraph.`
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
    
    console.log("Sending request to OpenRouter:", messages);
    
    // Make API call to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Skillher Coach"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as OpenRouterResponse;
    console.log("OpenRouter API response:", data);
    
    // Process and format the response
    const responseText = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.";
    const formattedResponse = formatResponseText(responseText);
    
    // Split the formatted response into multiple messages if it's too long
    const messageChunks = splitIntoMessageChunks(formattedResponse);
    return messageChunks;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return ["I'm experiencing some technical difficulties. Let's try again in a moment! 🙂"];
  }
};

// Format the response text to ensure proper paragraphs and line breaks
const formatResponseText = (text: string): string => {
  // Replace multiple consecutive line breaks with two line breaks for consistent paragraph spacing
  let formatted = text.replace(/\n{3,}/g, '\n\n');
  
  // Ensure there's space between paragraphs by replacing single line breaks with double
  formatted = formatted.replace(/([.!?])\s*\n([A-Z])/g, '$1\n\n$2');
  
  // Ensure emoji lines have proper spacing
  formatted = formatted.replace(/(\n[^\w\s]*[\p{Emoji}]+[^\w\s]*)\n/gu, '$1\n\n');
  
  return formatted;
};

// Split long messages into smaller chunks based on paragraphs
const splitIntoMessageChunks = (text: string): string[] => {
  // If the text is short enough, just return it as is
  if (text.length <= MAX_MESSAGE_LENGTH) {
    return [text];
  }
  
  // Split by paragraphs (double line breaks)
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit, start a new chunk
    if (currentChunk.length + paragraph.length > MAX_MESSAGE_LENGTH && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    }
  }
  
  // Add the last chunk if not empty
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

// Converts our message format to OpenRouter format
export const formatMessagesForOpenRouter = (messages: any[]): OpenRouterMessage[] => {
  return messages.map(msg => ({
    role: msg.sender === 'clara' ? 'assistant' : 'user',
    content: msg.text
  }));
};
