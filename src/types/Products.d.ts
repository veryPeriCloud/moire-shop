import { IQuery } from "./Products.d";
export interface IColor {
  id: number;
  title: string;
  code: string;
}

export interface IGalleryFile {
  extension: string;
  name: string;
  originalName: string;
  size: string;
  url: string;
}
interface IGallery {
  file: IGalleryFile;
}
export interface IProductColors {
  id: number;
  color: IColor;
  gallery: IGallery[];
}

export interface IProductCategory {
  id: number;
  title: string;
  slug: string;
}
export interface IFilter {
  page: number;
  minPrice: number | null;
  maxPrice: number | null;
  categoryId: number | null;
  materialIds: string[] | null;
  seasonIds: string[] | null;
  colorIds: string[] | null;
}

type Query = Omit<IFilter, "materialIds" | "seasonIds" | "colorIds">;
export interface IQuery extends Partial<Query> {
  "materialIds[]"?: string[] | string | null;
  "seasonIds[]"?: string[] | string | null;
  "colorIds[]"?: string[] | string | null;
}
export interface IParams extends IFilter {
  limit: number;
}

export interface IProductProperty {
  code: string;
  id: number;
  productsCount: number;
  title: string;
}
export interface IProductFromAPI {
  id: number;
  title: string;
  slug: string;
  price: number;
  colors: IProductColors[];
  seasons: IProductProperty[];
  materials: IProductProperty[];
}
export interface IProduct extends IProductFromAPI {
  image: string;
}
