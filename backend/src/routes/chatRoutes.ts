/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { sendMessageToChatGPT } from '../services/chatgptService.js';
import { generateImage } from '../services/chatgptService.js';
import { generateImageFromDrawing } from '../services/chatgptService.js';

const router = express.Router();

router.post('/chat', async (req, res: any) => {
	const { message } = req.body;
	const messages = message ? [{ role: 'user', content: message }] : req.body.messages;

	if (!messages || !Array.isArray(messages) || messages.length === 0) {
		return res.status(400).json({ error: 'Invalid or missing messages array' });
	}

	try {
		const response = await sendMessageToChatGPT(messages);
		res.status(200).json(response);
	} catch (error: any) {
		console.error('Error in /api/chat:', error.message);
		res.status(500).json({ error: error.message });
	}
});

router.post('/generate-image', async (req, res: any) => {
	const { prompt } = req.body;

	if (!prompt) {
		return res.status(400).json({ error: 'Prompt is required' });
	}

	try {
		const imageUrl = await generateImage(prompt);
		res.status(200).json({ imageUrl });
	} catch (error: any) {
		console.error('Error in /api/generate-image:', error.message);
		res.status(500).json({ error: error.message });
	}
});

router.post('/generate-image-from-drawing', async (req, res: any) => {
	const { image } = req.body;

	if (!image) {
		return res.status(400).json({ error: 'Image data is required' });
	}

	try {
		const imageUrl = await generateImageFromDrawing(image);
		res.status(200).json({ imageUrl });
	} catch (error: any) {
		console.error('Error in /api/generate-image-from-drawing:', error.message);
		res.status(500).json({ error: error.message });
	}
});

export default router;
