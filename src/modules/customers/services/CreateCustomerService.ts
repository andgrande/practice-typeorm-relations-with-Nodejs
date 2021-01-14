import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';
import ICreateCustomerDTO from '../dtos/ICreateCustomerDTO';

// interface IRequest {
//   name: string;
//   email: string;
// }

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: ICreateCustomerDTO): Promise<Customer> {
    if (!name || !email) {
      throw new AppError('Please provide Name and Email.');
    }

    let customer = await this.customersRepository.findByEmail(email);

    if (customer) {
      throw new AppError(
        'Email already registered, please try a different one.',
      );
    }

    customer = await this.customersRepository.create({ name, email });

    return customer;
  }
}

export default CreateCustomerService;
