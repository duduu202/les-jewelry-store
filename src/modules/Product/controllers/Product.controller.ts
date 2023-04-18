import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateProductService } from '../services/CreateProduct.service';
import { DeleteProductService } from '../services/DeleteProduct.service';
import { ListProductService } from '../services/ListProduct.service';
import { ShowProductService } from '../services/ShowProduct.service';
import { UpdateProductService } from '../services/UpdateProduct.service';



class ProductController {
  async create(req: Request, res: Response): Promise<Response> {
    const { price, stock, name, description } = req.body;

    const createProductService = container.resolve(CreateProductService);

    const Product = await createProductService.execute({
      price,
      stock,
      name,
      description,
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
    const { page, limit, name } = req.query;

    const listProductService = container.resolve(ListProductService);

    const Products = await listProductService.execute({
      //filters: {
      //},
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      // include: include ? { [String(include)]: true } : undefined,
      search: name ? String(name) : undefined,
    });

    return res.json(instanceToInstance(Products));
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
