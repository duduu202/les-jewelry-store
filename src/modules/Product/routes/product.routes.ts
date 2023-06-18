import { Router } from 'express';
import { uploadMulter } from '@config/upload';
import { verifyToken } from '@shared/middleware/verifyToken';
import {
  createProductMiddleware,
  deleteProductMiddleware,
  listProductMiddleware,
  refundProductMiddleware,
  showProductMiddleware,
  updateProductMiddleware,
} from './validators/product.validation';
import { ProductController } from '../controllers/Product.controller';
import verifyAuthorization from '@shared/middleware/verifyAuthorization';
import { UserRole } from '@prisma/client';

const productRouter = Router();
const productController = new ProductController();

productRouter.use(verifyToken);

productRouter.use(verifyAuthorization([UserRole.Customer, UserRole.Master]));
productRouter.get('/', listProductMiddleware, productController.index);
productRouter.get('/:id', showProductMiddleware, productController.show);

productRouter.use(verifyToken);

productRouter.use(verifyAuthorization([UserRole.Master]));
productRouter.post(
  '/',
  uploadMulter.single('image'),
  createProductMiddleware,
  productController.create,
);
productRouter.delete('/:id', deleteProductMiddleware, productController.delete);
productRouter.put('/:id', updateProductMiddleware, productController.update);

export { productRouter };
