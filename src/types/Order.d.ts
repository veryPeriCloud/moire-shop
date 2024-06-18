import type { IUser } from "./User";

export interface IOrderFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  deliveryTypeId: number;
  paymentTypeId: number;
  comment: string;
}

export type FormError = Omit<
  IOrderFormData,
  "deliveryTypeId" | "paymentTypeId" | "comment"
>;

export interface IDelivery {
  id: number;
  title: string;
  price: number;
}

export interface IPayment {
  id: number;
  title: string;
}

export interface IOrderInfo {
  address: "";
  basket: {
    id: number;
    items: ICartProductData[];
  };
  user: IUser;
  comment: string;
  deliveryType: IDelivery;
  email: string;
  id: number;
  name: string;
  paymentType: string;
  phone: string;
  status: IOrderStatus;
  totalPrice: number;
}

export interface IOrderStatus {
  id: number;
  code: string;
  title: string;
}
