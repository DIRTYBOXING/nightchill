import { Router, Request, Response } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const chatController = new ChatController();

/**
 * @route   POST /api/chat/message
 * @desc    Send a message to the chat bot
 * @access  Private
 */
router.post('/message', authenticate, (req: Request, res: Response) => 
  chatController.sendMessage(req, res)
);

/**
 * @route   GET /api/chat/history
 * @desc    Get chat history
 * @access  Private
 */
router.get('/history', authenticate, (req: Request, res: Response) => 
  chatController.getHistory(req, res)
);

/**
 * @route   DELETE /api/chat/clear
 * @desc    Clear chat history
 * @access  Private
 */
router.delete('/clear', authenticate, (req: Request, res: Response) => 
  chatController.clearHistory(req, res)
);

export default router;
