/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";
import OpenAI from "openai";
import { ChatMessage } from "../types/chatgpt.js";

const openai = new OpenAI({
    organization: "org-vNxy6DD6IEOrPLDlw6qENMzR",
    project: process.env.OPENAI_PROJECT_ID,
});

export async function sendMessageToChatGPT(
    messages: ChatMessage[],
    model: string = 'gpt-4o',
    max_tokens: number = 150
): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured in the environment.');
    }

    try {
        const response = await openai.chat.completions.create({
            messages: messages,
            model: model,
            max_tokens: max_tokens,
        });
        return response.choices[0].message.content;
    } catch (error: any) {
        console.error('Error communicating with ChatGPT API:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'ChatGPT API error');
    }
}
