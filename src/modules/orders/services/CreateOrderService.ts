import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
  price: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError(
        'This order cannot be related with signed customer, please sign in.',
      );
    }

    const products_id = [
      ...products.map(product => {
        const { id } = product;
        return { id };
      }),
    ];

    const productsInStock = await this.productsRepository.findAllById(
      products_id,
    );

    const missingInStock: [] | any = [];
    const invalidProduct: [] | any = [];
    const updatedProducts: [] | any = [];

    products.forEach(product => {
      const idx = productsInStock.findIndex(item => item.id === product.id);

      if (idx === -1) {
        invalidProduct.push(product.id);
      } else if (productsInStock[idx].quantity < product.quantity) {
        missingInStock.push(product.id);
      } else {
        updatedProducts.push({
          ...product,
          price: productsInStock[idx].price,
          discount: productsInStock[idx].discount_rate,
        });
      }
    });

    if (invalidProduct.length) {
      throw new AppError(
        `The following product is not present in out stock: ${invalidProduct}`,
      );
    }

    if (missingInStock.length > 0) {
      throw new AppError(
        `Not enought quantity for product ${missingInStock} in our stock.`,
      );
    }

    const order = await this.ordersRepository.create({
      customer,
      products: updatedProducts,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
