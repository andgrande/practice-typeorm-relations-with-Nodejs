import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    let total_amount = 0;
    const order_products = [
      ...products.map(item => {
        total_amount +=
          (item.price -
            (item.discount ? (item.price * item.discount) / 100 : 0)) *
          item.quantity;
        return {
          product_id: item.id,
          price: item.price,
          quantity: item.quantity,
          discount_rate: item.discount,
        };
      }),
    ];

    const order = this.ormRepository.create({
      customer,
      order_products,
      total_amount,
    });

    await this.ormRepository.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    return order;
  }
}

export default OrdersRepository;
