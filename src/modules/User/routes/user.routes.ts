import { Router } from 'express';

// import { uploadMulter } from '@config/upload';
import { verifyToken } from '@shared/middleware/verifyToken';
import { UserController } from '../controllers/User.controller';
// import { UserAvatarController } from '../controllers/UserAvatar.controller';
import { passwordRouter } from './password.routes';
import { sessionRouter } from './session.routes';
import {
  createUserMiddleware,
  deleteUserMiddleware,
  listUserMiddleware,
  showUserMiddleware,
  updateUserMiddleware,
} from './validators/user.validation';

const userRouter = Router();

const userController = new UserController();
// const userAvatarController = new UserAvatarController();

userRouter.use('/password', passwordRouter);

userRouter.use('/session', sessionRouter);

// userRouter.use(verifyToken);

// userRouter.patch(
//  '/:user_id/avatar',
//  [uploadMulter.single('avatar'), updateUserAvatarMiddleware],
//  userAvatarController.update,
// );
//
// userRouter.delete(
//  '/:user_id/avatar',
//  deleteUserAvatarMiddleware,
//  userAvatarController.delete,
// );

// userRouter.use(verifyToken);
userRouter.use(verifyToken);

userRouter.put('/:user_id', updateUserMiddleware, userController.update);

userRouter.delete('/:user_id', deleteUserMiddleware, userController.delete);

userRouter.get('/', listUserMiddleware, userController.index);

userRouter.get('/:user_id', showUserMiddleware, userController.show);

userRouter.post('/', createUserMiddleware, userController.create);

export { userRouter };
