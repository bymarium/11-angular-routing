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
  dishId: number;
}

export interface IOrders {
  id: number;
  clientId: number;
  date: Date | string | null;
  totalPrice: number | string | null;
  orderDetails: IOrderDetails[];
  dishesQuantity?: number;
}