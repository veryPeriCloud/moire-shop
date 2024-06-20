import { IProduct, IProductColors } from "./Products.d";

interface IProductSizeInCart {
  id: number;
  title: string;
}

export interface ICartProductData {
  id: number;
  price: number;
  quantity: number;
  color: IProductColors;
  size: IProductSizeInCart;
  product: IProduct;
}

export interface ICartProductDataWithImg extends ICartProductData {
  image: string;
}

export interface ICartProduct {
  productId: number;
  quantity: number;
  colorId: number;
  sizeId: number
}

export interface ICartDetailProduct extends ICartProductData {
  image: string;
}

export interface ICart {
  id: number;
  items: ICartItem[];
  user: IUser;
}

export interface IUpdateProductAmountArgs {
  basketItemId: number;
  quantity: number;
}
