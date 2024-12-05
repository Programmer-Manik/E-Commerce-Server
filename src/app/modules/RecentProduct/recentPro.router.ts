import express from 'express';
import { RecentProductController } from './recentPro.controller';

const router = express.Router();


router.get('/:userId', RecentProductController.getByUserId);

export const RecentProductRoutes = router;