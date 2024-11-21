export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatGPTResponse {
    id: string;
    object: string;
    created: number;
    choices: Array<{
        message: ChatMessage;
        finish_reason: string;
        index: number;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
