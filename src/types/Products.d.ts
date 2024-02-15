interface IColor {
  id: number;
  title: string;
  code: string;
}

interface IGalleryFile {
  extension: string;
  name: string;
  originalName: string;
  size: string;
  url: string;
}
interface IGallery {
  file: IGalleryFile
}
interface IProductColor {
  id: number;
  color: IColor[];
  gallery: IGallery[]
}

interface IProductSeasons {
  id: number;
  title: string;
  code: string;
  productsCount: number
}

interface IProductMaterials extends IProductSeasons {}
 export interface IProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  image: string;
  colors: IProductColor[];
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

export interface IQuery {
  page?: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  categoryId?: number | null;
  materialIds?: string[] | null;
  seasonIds?: string[] | null;
  colorIds?: string[] | null;
}

export interface IParams extends IFilter {
  limit: number;
}