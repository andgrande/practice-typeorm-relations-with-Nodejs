export default interface ICreateProductDTO {
  name: string;
  price: number;
  quantity: number;
  discount: number | undefined;
}
