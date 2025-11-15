import express from 'express';
import { createStory, getStories, getStory, updateStory, deleteStory } from '../controllers/storyController.js';
import { uploadHandler } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js'

const router = express.Router();

router.get('/', getStories);
router.get('/:id', getStory);
router.post('/', authenticate, uploadHandler.array('slides'), createStory);
router.put('/:id', authenticate, uploadHandler.array('slides'), updateStory);
router.delete('/:id', authenticate, deleteStory);

export default router;
