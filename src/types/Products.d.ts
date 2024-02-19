import type console from 'console';
import { IQuery } from './Products.d';
interface IColor {
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
  file: IGalleryFile
}
export interface IProductColors {
  id: number;
  color: IColor[];
  gallery: IGallery[]
}

export interface IProductSeasons {
  id: number;
  title: string;
  code: string;
  productsCount: number
}

export interface IProductCategory {
  id: number;
  title: string;
  slug: string;
}

export interface IProductMaterials extends IProductSeasons {}
 export interface IProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  image: string;
  categoryId: nullmber;
  colors: IProductColors[];
  seasons: IProductSeasons[];
  materials: IProductMaterials[];
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

type Query = Omit<IFilter, 'materialIds' | 'seasonIds' | 'colorIds'>
export interface IQuery extends Partial<Query> {
  'materialIds[]'?: string[] | string | null;
  'seasonIds[]'?: string[] | string | null;
  'colorIds[]'?: string[] | string | null;
}
export interface IParams extends IFilter {
  limit: number;
}