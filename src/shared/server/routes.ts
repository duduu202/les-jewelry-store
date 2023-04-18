import { Router, Request, Response, NextFunction } from 'express';

import { userRouter } from '@modules/User/routes/user.routes';
import { addressRouter } from '@modules/Address/routes/address.routes';

const router = Router();

router.use('/user', userRouter);
router.use('/address', addressRouter);
// router.use('/project', projectRouter);

router.get('/', (request: Request, response: Response) =>
  response.send('jewelry store - 0.0.1'),
);

router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.route)
    return response.status(404).send(`${request.url} não encontrado`);
  return next();
});

export { router };
