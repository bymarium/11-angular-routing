import { IDishes } from "./dish.interface";

export interface IMenu {
  name: string;
  description: string;
}

export interface IMenus {
  id: number;
  name: string;
  description: string;
  dishes?: IDishes[];
}