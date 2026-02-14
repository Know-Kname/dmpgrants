// Vercel Serverless Function - Express API wrapper
// This exposes the Express backend as a Vercel serverless function
// All /api/* requests are routed here by vercel.json

import app from '../server/index.js';

export default app;
