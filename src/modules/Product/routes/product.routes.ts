import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { 
  createProductMiddleware,
  deleteProductMiddleware,
  listProductMiddleware,
  updateProductMiddleware
} from './validators/product.validation';
import { ProductController } from '../controllers/Product.controller';
import verifyAuthorization from '@shared/middleware/verifyAuthorization';
import { UserRole } from '@prisma/client';

const productRouter = Router();
const productController = new ProductController();

productRouter.use(verifyToken);

productRouter.use(verifyAuthorization([UserRole.Customer, UserRole.Master]));
productRouter.get('/', listProductMiddleware, productController.index);

productRouter.use(verifyAuthorization([UserRole.Master]));
productRouter.post('/', createProductMiddleware, productController.create);
productRouter.delete('/:id', deleteProductMiddleware, productController.delete);
productRouter.put('/:id', updateProductMiddleware, productController.update);


export { productRouter };
