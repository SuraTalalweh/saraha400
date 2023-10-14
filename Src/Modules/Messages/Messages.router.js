import express from 'express'
import * as messageController from'./Controller/Messages.controller.js'
import { asyncHandler } from '../../Middleware/errorHandling.js';
import { auth } from '../../Middleware/Auth.Middleware.js';
const app =express();

app.post('/:receiverId',asyncHandler(messageController.sendMessage))
app.get('/',auth,messageController.getMessages);
export default app;