import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import IUpdateProductsDiscountDTO from '@modules/products/dtos/IUpdateProductsDiscountDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
    discount,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
      discount_rate: discount,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { id } });

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const products_ids = [...products.map(product => product.id)];
    const product = await this.ormRepository.find({
      where: {
        id: In(products_ids),
      },
    });

    return product;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const products_ids = [...products.map(product => product.id)];
    const queryProducts = await this.ormRepository.find({
      where: {
        id: In(products_ids),
      },
    });

    products.forEach(product => {
      const idx = queryProducts.findIndex(item => item.id === product.id);

      if (idx < 0) {
        throw new AppError(`Product ${product.id} not found`);
      }

      queryProducts[idx].quantity -= product.quantity;
    });

    await this.ormRepository.save(queryProducts);
    return queryProducts;
  }

  public async updateDiscount({
    id,
    discount,
  }: IUpdateProductsDiscountDTO): Promise<Product> {
    const queryProduct = await this.ormRepository.findOne({ where: { id } });

    if (!queryProduct) {
      throw new AppError('Not found');
    }

    queryProduct.discount_rate = discount;

    await this.ormRepository.save(queryProduct);

    return queryProduct;
  }

  // update Discount In Bulk
  //   public async updateProductsDiscount(
  //     products: IUpdateProductsDiscountDTO[],
  //   ): Promise<Product[]> {
  //     const products_ids = [...products.map(product => product.id)];
  //     const queryProducts = await this.ormRepository.find({
  //       where: {
  //         id: In(products_ids),
  //       },
  //     });

  //     products.forEach(product => {
  //       const idx = queryProducts.findIndex(item => item.id === product.id);

  //       if (idx < 0) {
  //         throw new AppError(`Product ${product.id} not found`);
  //       }

  //       queryProducts[idx].discount_rate = product.discount;
  //     });

  //     await this.ormRepository.save(queryProducts);
  //     return queryProducts;
  //   }
}

export default ProductsRepository;
