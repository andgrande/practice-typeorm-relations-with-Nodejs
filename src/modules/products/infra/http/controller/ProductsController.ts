import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import AppError from '@shared/errors/AppError';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity, discount } = request.body;

    if (discount < 0 || discount > 80) {
      throw new AppError(
        'Discount rate cannot be lower than 5% or higher than 80%',
      );
    }

    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price,
      quantity,
      discount,
    });

    return response.status(200).json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { discount } = request.body;
    const { id } = request.params;

    if (discount < 0 || discount > 80) {
      throw new AppError(
        'Discount rate cannot be lower than 5% or higher than 80%',
      );
    }

    const updateProductService = container.resolve(UpdateProductService);
    const product = await updateProductService.execute({
      id,
      discount,
    });

    return response.status(200).json(product);
  }
}
