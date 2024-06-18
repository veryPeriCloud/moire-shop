import axios from "axios";
import { defineStore } from "pinia";
import { useSerialize } from "@/composables/serialize";
import type {
  IProductFromAPI,
  IProduct,
  IFilter,
  IParams,
  IProductColors,
  IProductProperty,
  IProductCategory,
  IQuery,
  IColor,
} from "@/types/Products.d.ts";
import type { IDetailProductFromAPI } from "@/types/Product.d.ts";
import { API_BASE_URL } from "@/assets/ts/config";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: null as IProductFromAPI[] | null,
    product: null as IDetailProductFromAPI | null,

    pagination: {
      perPage: 9,
      total: null,
    },

    filters: {
      page: 1,
      minPrice: null,
      maxPrice: null,
      categoryId: 0,
      materialIds: [],
      seasonIds: [],
      colorIds: [],
    } as IFilter,

    categories: null as IProductCategory[] | null,
    materials: null as IProductProperty[] | null,
    seasons: null as IProductProperty[] | null,
    colors: null as IColor[] | null,
  }),
  getters: {
    getProducts: (state): IProduct[] => {
      if (state.products === null) {
        return [];
      }

      return state.products.map((item: any) => {
        return {
          ...item,
          image:
            item.colors[0].gallery !== null
              ? item.colors[0].gallery[0].file.url
              : null,
        };
      });
    },
    getProduct: (state): IDetailProductFromAPI | null => state.product,
    getProductsCount: (state): number =>
      state.pagination.total ? state.pagination.total : 0,
    getTotalPages: (state): number => {
      if (state.pagination.total) {
        return Math.ceil(state.pagination.total / state.pagination.perPage);
      } else {
        return 0;
      }
    },
    getFilters: (state): IFilter => state.filters,
    getFiltersAsUrl: (state): string => useSerialize(state.filters),

    getMaterials: (state): IProductProperty[] =>
      state.materials ? state.materials : [],
    getCategories: (state): IProductCategory[] =>
      state.categories ? state.categories : [],
    getSeasons: (state): IProductProperty[] =>
      state.seasons ? state.seasons : [],
    getColors: (state): IProductColors[] => (state.colors ? state.colors : []),
  },
  actions: {
    setFilters(query: IQuery): void {
      if (query.page) this.filters.page = query.page;
      if (query.minPrice) {
        this.filters.minPrice = query.minPrice;
      }
      if (query.maxPrice) {
        this.filters.maxPrice = query.maxPrice;
      }
      if (query.categoryId) {
        this.filters.categoryId = query.categoryId;
      }
      if (query["materialIds[]"]) {
        this.filters.materialIds = [...query["materialIds[]"]];
      }
      if (query["seasonIds[]"]) {
        this.filters.seasonIds = [...query["seasonIds[]"]];
      }
      if (query["colorIds[]"]) {
        this.filters.colorIds = [...query["colorIds[]"]];
      }
    },

    setPageFilter(page: number): void {
      this.filters.page = page;
    },

    setCatalogFilter(query: IQuery): void {
      if (query.minPrice) {
        this.filters.minPrice = query.minPrice;
      }
      if (query.maxPrice) {
        this.filters.maxPrice = query.maxPrice;
      }
      if (query.categoryId) {
        this.filters.categoryId = query.categoryId;
      }
      if (query["materialIds[]"]) {
        this.filters.materialIds = [...query["materialIds[]"]];
      }
      if (query["seasonIds[]"]) {
        this.filters.seasonIds = [...query["seasonIds[]"]];
      }
      if (query["colorIds[]"]) {
        this.filters.colorIds = [...query["colorIds[]"]];
      }
    },

    clearFilters(): void {
      this.filters.page = 1;
      this.filters.minPrice = null;
      this.filters.maxPrice = null;
      this.filters.categoryId = null;
      this.filters.materialIds = [];
      this.filters.seasonIds = [];
      this.filters.colorIds = [];
    },

    async fetchProduct(slug: String): Promise<void> {
      await axios
        .get(`${API_BASE_URL}/api/products/${slug}`)
        .then((response) => (this.product = response.data))
        .catch((err) => console.error(err));
    },

    async fetchProducts(): Promise<void> {
      const params = {
        limit: this.pagination.perPage,
        ...this.filters,
      } as IParams;
      await axios
        .get(`${API_BASE_URL}/api/products`, {
          params: params,
          paramsSerializer: {
            indexes: false,
          },
        })
        .then((response) => {
          this.products = response.data.items;
          this.pagination.total = response.data.pagination.total;
        })
        .catch((err: Error) => {
          console.error(err);
        });
    },

    async fetchCategories(): Promise<void> {
      axios
        .get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => (this.categories = response.data.items));
    },

    async fetchMaterials(): Promise<void> {
      axios
        .get(`${API_BASE_URL}/api/materials`)
        .then((response) => (this.materials = response.data.items));
    },

    async fetchSeasons(): Promise<void> {
      axios
        .get(`${API_BASE_URL}/api/seasons`)
        .then((response) => (this.seasons = response.data.items));
    },

    async fetchColors(): Promise<void> {
      axios
        .get(`${API_BASE_URL}/api/colors`)
        .then((response) => (this.colors = response.data.items));
    },
  },
});
