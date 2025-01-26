import { IDishes } from "./dish.interface";

export interface IOrder {
  clientId: number;
  orderDetails: IOrderDetail[];
}

export interface IOrderDetail {
  dishId: number;
  quantity: number;
}

export interface IOrderDetails {
  id: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  dish: IDishes;
}

export interface IOrders {
  id: number;
  date: Date;
  totalPrice: number;
  orderDetails: IOrderDetails[];
}