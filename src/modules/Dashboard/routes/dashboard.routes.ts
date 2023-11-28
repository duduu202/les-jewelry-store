import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import verifyAuthorization from '@shared/middleware/verifyAuthorization';
import { UserRole } from '@prisma/client';
import { DashboardController } from '../controllers/Dashboard.controller';
import { showDashboardMiddleware } from './validators/dashboard.validation';

const dashboardRouter = Router();

const dashboardController = new DashboardController();
dashboardRouter.use(verifyToken);

dashboardRouter.get(
  '/',
  verifyAuthorization([UserRole.Master]),
  showDashboardMiddleware,
  dashboardController.show,
);

export { dashboardRouter };
