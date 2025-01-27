export interface IDish {
  name: string;
  description: string;
  price: number;
  menuId: number;
}

export interface IDishes {
  id: number;
  name: string;
  description: string;
  price: number | string | null;
  type: string;
  menuId?: number;
  menuName?: string | null;
}