
// OpenRouter API service for enhancing Skillher Coach with AI capabilities

// Updated API key
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
  previousMessages: OpenRouterMessage[] = [],
  contextFocus: string = ""
): Promise<string> => {
  try {
    // Create system message for Skillher Coach's persona with optional context focus
    const systemMessage: OpenRouterMessage = {
      role: "system",
      content: `You are a friendly AI coach ${contextFocus || "focused on wellness, career growth, and personal development for women"}. 
      Your tone is encouraging, empathetic, and positive. You offer practical advice and emotional support.
      You're speaking with ${userName}. Use emojis naturally to express emotions and add warmth to your responses.
      
      Important formatting rules to follow:
      1. Use proper punctuation (periods, commas, question marks) correctly and consistently.
      2. Do not use markdown formatting like asterisks for bold or italics (e.g., do not use ** or * for emphasis).
      3. Format your responses with proper paragraphing and line breaks for readability.
      4. Separate distinct ideas into different paragraphs.
      5. When providing lists, format each item on a new line with proper spacing.
      6. If sharing step-by-step instructions, number them and put each step on its own line.
      7. Keep your overall response concise but helpful.
      8. Be careful with punctuation at the end of sentences and when using quotes.
      9. Never break words across lines - ensure proper word wrapping.
      10. Ensure sentences are complete and not truncated.`
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
    
    // Make API call to OpenRouter with improved error handling
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
        max_tokens: 600
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json() as OpenRouterResponse;
    console.log("OpenRouter API response:", data);
    
    // Get the response text and clean up any markdown formatting
    let responseText = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment.";
    
    // Remove markdown formatting (** for bold, * for italic)
    responseText = responseText.replace(/\*\*(.*?)\*\*/g, '$1');
    responseText = responseText.replace(/\*(.*?)\*/g, '$1');
    
    // Apply enhanced formatting to ensure proper text structure
    const formattedResponse = formatResponseText(responseText);
    
    return formattedResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Provide a more specific fallback response based on the error
    if (error instanceof Error && error.message.includes("401")) {
      return "I'm having trouble with my connection right now. It seems there might be an authentication issue with my AI service. Please try again in a moment, or contact support if this issue persists. 🙂";
    }
    
    // General fallback response
    return "I'm having trouble connecting to my knowledge base right now. This could be due to high traffic or a temporary outage. Please try asking your question again in a moment, or refresh the page if the issue persists. Thank you for your patience! 🙂";
  }
};

// Enhanced formatting function to ensure proper paragraphs and line breaks
const formatResponseText = (text: string): string => {
  // Ensure consistent paragraph breaks (at least two line breaks between paragraphs)
  let formatted = text.replace(/\n{3,}/g, '\n\n');
  
  // Ensure list items are properly formatted with line breaks
  formatted = formatted.replace(/(\n[•\-\*]\s[^\n]+)(?!\n)/g, '$1\n');
  
  // Ensure numbered lists are properly formatted
  formatted = formatted.replace(/(\n\d+\.\s[^\n]+)(?!\n)/g, '$1\n');
  
  // Ensure emoji lines have proper spacing
  formatted = formatted.replace(/(\n[^\w\s]*[\p{Emoji}]+[^\w\s]*)(?!\n)/gu, '$1\n');
  
  // Check for proper sentence punctuation - add periods to sentences without ending punctuation
  formatted = formatted.replace(/([a-zA-Z])\s+([A-Z])/g, '$1. $2');
  
  // Ensure no words are broken across lines
  formatted = formatted.replace(/(\w)-\n(\w)/g, '$1$2');
  
  // Ensure all sentences end with proper punctuation
  formatted = formatted.replace(/([a-zA-Z])(\n|$)/g, '$1.$2');
  
  return formatted;
};

// Converts our message format to OpenRouter format
export const formatMessagesForOpenRouter = (messages: any[]): OpenRouterMessage[] => {
  return messages.map(msg => ({
    role: msg.sender === 'skillher' ? 'assistant' : 'user',
    content: msg.text
  }));
};
