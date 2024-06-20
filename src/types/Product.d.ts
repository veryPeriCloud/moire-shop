import type { IProductFromAPI } from "@/types/Products"

export interface IProductCategory {
  id: number;
  title: string;
  slug: string;
}

export interface IDetailSize {
  id: number;
  title: string;
}

export interface IDetailProductFromAPI extends IProductFromAPI {
  category: IProductCategory;
  sizes: IDetailSize[];
  content: string;
}