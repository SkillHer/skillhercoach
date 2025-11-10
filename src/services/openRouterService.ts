
// AI service for Skillher Coach using Lovable AI

const CHAT_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

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
    // Add the current user message to the conversation
    const allMessages = [
      ...previousMessages.slice(-10),
      { role: "user" as const, content: userMessage }
    ];
    
    console.log("Sending request to Lovable AI chat function");
    
    // Call the edge function
    const response = await fetch(CHAT_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: allMessages,
        userName,
        interestContext: contextFocus
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("AI function error:", response.status, errorData);
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits exhausted. Please contact support.");
      }
      
      throw new Error(`API error: ${response.status} - ${errorData.error || "Unknown error"}`);
    }
    
    const data = await response.json();
    console.log("AI response received");
    
    let responseText = data.message || "I'm sorry, I couldn't generate a response at the moment.";
    
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

// Enhanced formatting function to ensure proper paragraphs, punctuation, and line breaks
const formatResponseText = (text: string): string => {
  // Normalize whitespace first (replace multiple spaces with single space)
  let formatted = text.replace(/[ \t]+/g, ' ');
  
  // Fix spacing after punctuation (ensure space after periods, commas, question marks, exclamation points)
  formatted = formatted.replace(/([.!?,;:])(?=[a-zA-Z0-9])/g, '$1 ');
  
  // Fix spacing before punctuation (remove space before periods, commas, etc.)
  formatted = formatted.replace(/\s+([.!?,;:])/g, '$1');
  
  // Fix spacing with parentheses and quotation marks
  formatted = formatted.replace(/\(\s+/g, '(');  // Remove space after opening parenthesis
  formatted = formatted.replace(/\s+\)/g, ')');  // Remove space before closing parenthesis
  formatted = formatted.replace(/"\s+/g, '"');   // Remove space after opening quote
  formatted = formatted.replace(/\s+"/g, '"');   // Remove space before closing quote
  
  // Fix spacing with emoji (ensure space before emoji if preceded by text)
  formatted = formatted.replace(/([a-zA-Z0-9])(\p{Emoji})/gu, '$1 $2');
  
  // Ensure consistent paragraph breaks (at least two line breaks between paragraphs)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Ensure list items are properly formatted with line breaks
  formatted = formatted.replace(/(\n[•\-\*]\s[^\n]+)(?!\n)/g, '$1\n');
  
  // Ensure numbered lists are properly formatted
  formatted = formatted.replace(/(\n\d+\.\s[^\n]+)(?!\n)/g, '$1\n');
  
  // Fix sentences missing periods before new sentences
  formatted = formatted.replace(/([a-zA-Z0-9])(\s+[A-Z])/g, '$1.$2');
  
  // Ensure no words are broken across lines
  formatted = formatted.replace(/(\w)-\n(\w)/g, '$1$2');
  
  // Ensure all sentences end with proper punctuation if they don't already
  formatted = formatted.replace(/([a-zA-Z0-9])(\s*\n|\s*$)/g, (match, p1, p2) => {
    // Only add period if the sentence doesn't already end with punctuation
    if (!/[.!?,;:]$/.test(p1)) {
      return p1 + '.' + p2;
    }
    return match;
  });
  
  // Fix double periods
  formatted = formatted.replace(/\.+/g, '.');
  
  // Fix spacing with periods at the end of sentences (ensure single space after period)
  formatted = formatted.replace(/\.(\s*)([A-Z])/g, '. $2');
  
  // Fix line breaks after periods at the end of paragraphs
  formatted = formatted.replace(/\.\n/g, '.\n\n');
  
  // Trim extra whitespace at the beginning and end
  formatted = formatted.trim();
  
  return formatted;
};

// Converts our message format to OpenRouter format
export const formatMessagesForOpenRouter = (messages: any[]): OpenRouterMessage[] => {
  return messages.map(msg => ({
    role: msg.sender === 'skillher' ? 'assistant' : 'user',
    content: msg.text
  }));
};
