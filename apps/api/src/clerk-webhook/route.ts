import express, { Router } from "express";

const webhookRouter = Router();

webhookRouter.post('/clerk/webhook', express.raw({ type: 'application/json' }), (req, res) => {
	console.log('webhook', req.body);
	res.sendStatus(200);
});

export default webhookRouter;