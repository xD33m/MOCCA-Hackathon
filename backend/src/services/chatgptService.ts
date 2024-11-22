/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';
import { ChatMessage } from '../types/chatgpt.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const openai = new OpenAI({
	organization: 'org-vNxy6DD6IEOrPLDlw6qENMzR',
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
		console.error(
			'Error communicating with ChatGPT API:',
			error.response?.data || error.message
		);
		throw new Error(error.response?.data?.error?.message || 'ChatGPT API error');
	}
}

export async function generateImage(prompt: string): Promise<string> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error('OpenAI API key is not configured in the environment.');
	}

	try {
		if (process.env.ENV !== 'prod') {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const randomId = Math.floor(Math.random() * 50);
			return `https://picsum.photos/id/${randomId}/512/512`;
		}
		const response = await openai.images.generate({
			prompt: prompt,
			n: 1,
			size: '256x256',
		});

		// Return the URL of the generated image
		return response.data[0].url;
	} catch (error: any) {
		console.error('Error generating image:', error.response?.data || error.message);
		throw new Error(error.response?.data?.error?.message || 'Image generation error');
	}
}

export async function generateImageFromDrawing(base64Image: string): Promise<string> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error('OpenAI API key is not configured in the environment.');
	}

	if (process.env.ENV !== 'prod') {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const randomId = Math.floor(Math.random() * 50);
		return `https://picsum.photos/id/${randomId}/512/512`;
	}

	const imageBuffer = Buffer.from(base64Image, 'base64');
	const file: any = imageBuffer;
	file.name = 'temp_image.png';
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const tempImagePath = join(__dirname, 'temp_image.png');
	fs.writeFileSync(tempImagePath, imageBuffer);

	try {
		const response = await openai.images.edit({
			image: fs.createReadStream(tempImagePath) as any,
			prompt: 'This drawing represents a hand drawn representation of something real. Turn this hand-drawn sketch into a realistic image',
			n: 1,
			size: '512x512',
		});

		fs.unlinkSync(tempImagePath);

		return response.data[0].url;
	} catch (error: any) {
		fs.unlinkSync(tempImagePath);

		console.log(error);
		console.error('Error generating image variation:', error.response?.data || error.message);
		throw new Error(error.response?.data?.error?.message || 'Image generation error');
	}
}
