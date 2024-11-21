import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = 3000;

const server = createServer(app);

app.use(cors());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend! ' + process.env.ENV });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


process.on('SIGINT', function () {
	console.log('\nGracefully shutting down');
	process.exit(0);
});
