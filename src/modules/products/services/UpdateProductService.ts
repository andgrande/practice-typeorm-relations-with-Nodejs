import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
  discount: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id, discount }: IRequest): Promise<Product> {
    let product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found. Please make sure it is registed.');
    }

    product = await this.productsRepository.updateDiscount({
      id,
      discount,
    });

    return product;
  }
}

export default CreateProductService;
