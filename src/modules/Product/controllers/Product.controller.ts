import { AppError } from '@shared/error/AppError';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateProductService } from '../services/CreateProduct.service';
import { DeleteProductService } from '../services/DeleteProduct.service';
import { ListCategoryService } from '../services/ListCategories.service';
import { ListProductService } from '../services/ListProduct.service';
import { ShowProductService } from '../services/ShowProduct.service';
import { UpdateProductService } from '../services/UpdateProduct.service';

class ProductController {
  async create(req: Request, res: Response): Promise<Response> {
    const { price, stock, name, description, categories } = req.body;
    // if (!req.file) {
    //  throw new AppError('Nenhum arquivo enviado', 400);
    // }

    const createProductService = container.resolve(CreateProductService);

    const Product = await createProductService.execute({
      price,
      stock,
      name,
      description,
      image: req.file?.filename,
      categories,
    });

    return res.status(201).json(instanceToInstance(Product));
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;

    const showProductService = container.resolve(ShowProductService);

    const Product = await showProductService.execute({
      id,
      request_id: user.id,
    });

    return res.json(Product);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, search } = req.query;

    const listProductService = container.resolve(ListProductService);

    const Products = await listProductService.execute({
      filters: {},
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      // include: include ? { [String(include)]: true } : undefined,
      search: search ? String(search) : undefined,
    });

    return res.json(instanceToInstance(Products));
  }

  async indexCategories(req: Request, res: Response): Promise<Response> {
    const listCategoryService = container.resolve(ListCategoryService);

    const categories = await listCategoryService.execute();

    return res.json(instanceToInstance(categories));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { ...data } = req.body;

    const updateProductService = container.resolve(UpdateProductService);

    const Product = await updateProductService.execute({
      id,
      request_id: req.user.id,
      ...data,
    });

    return res.json(instanceToInstance(Product));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteProductService = container.resolve(DeleteProductService);

    await deleteProductService.execute({
      id,
      request_id: req.user.id,
    });

    return res.status(204).send();
  }
}

export { ProductController };
