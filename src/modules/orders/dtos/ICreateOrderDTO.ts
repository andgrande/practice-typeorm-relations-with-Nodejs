import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IProduct {
  id: string;
  price: number;
  quantity: number;
  discount: number | undefined;
}

export default interface ICreateOrderDTO {
  customer: Customer;
  products: IProduct[];
}
