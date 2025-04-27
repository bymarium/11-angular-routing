import { IOrders } from "./order.interface";

export interface IClient {
  name: string;
  lastName: string;
  email: string;
}

export interface IClients {
  id: number;
  name: string;
  lastName: string;
  email: string;
  userType: string;
  orders?: IOrders[];
  quantity?: number;
}