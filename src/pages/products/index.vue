<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductFilter from "@/components/catalog/ProductFilter.vue";
import ProductFilterMobile from "@/components/catalog/ProductFilterMobile.vue";
import ProductList from "@/components/catalog/ProductList.vue";
import BasePagination from "@/components/ui/BasePagination.vue";
import BaseLoader from "@/components/ui/BaseLoader.vue";
import { useProductsStore } from "@/stores/products";
import { useRoute, useRouter } from "vue-router";
import type {
  IFilter,
  IProductColors,
  IProductSeasons,
  IProductMaterials,
  IProductCategory,
} from "@/types/Products.d.ts";

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const resolved = ref(false);
const isLoadingFaild = ref(false);
const showMobFilter = ref(false);

const products = computed(() => productsStore.getProducts);
const countOfProducts = computed(() => productsStore.getProductsCount);
const totalPages = computed(() => productsStore.getTotalPages);

const categories = computed(
  (): IProductCategory[] => productsStore.getCategories
);
const materials = computed(
  (): IProductMaterials[] => productsStore.getMaterials
);
const seasons = computed((): IProductSeasons[] => productsStore.getSeasons);
const colors = computed((): IProductColors[] => productsStore.getColors);

onMounted(async () => {
  try {
    productsStore.setFilters(route.query);
    productsStore.setCatalogFilter(route.query);
  } catch (error) {
    console.log(error);
  }
  await productsStore
    .fetchProducts()
    .then(() => (resolved.value = true))
    .catch(() => (isLoadingFaild.value = true));

  await productsStore.fetchCategories();
  await productsStore.fetchMaterials();
  await productsStore.fetchSeasons();
  await productsStore.fetchColors();
});

const updateFilter = async (filters: IFilter): Promise<void> => {
  productsStore.setCatalogFilter(filters);
  productsStore.setPageFilter(1);
  await updateProducts(productsStore.getFilters);
  closeFilter();
};

const clearFilter = async (): Promise<void> => {
  productsStore.clearFilters();
  await updateProducts(productsStore.getFilters);
};

const updatePage = async (page: number): Promise<void> => {
  productsStore.setPageFilter(page);
  await updateProducts(productsStore.getFilters);
};

const updateProducts = async (filters: IFilter): Promise<void> => {
  resolved.value = false;

  productsStore.setFilters(filters);
  router.push(route.path + "?" + productsStore.getFiltersAsUrl);
  await productsStore.fetchProducts().then(() => (resolved.value = true));
};
const body = document.getElementById("body");

const openFilter = () => {
  showMobFilter.value = !showMobFilter.value;
  body.style.position = "fixed";
};
const closeFilter = () => {
  showMobFilter.value = false;
  body.style.position = "relative";
};
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info"> {{ countOfProducts }} товаров </span>
      </div>
      <button class="content__mob-filter-btn" @click="openFilter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-sliders-horizontal"
        >
          <line x1="21" x2="14" y1="4" y2="4" />
          <line x1="10" x2="3" y1="4" y2="4" />
          <line x1="21" x2="12" y1="12" y2="12" />
          <line x1="8" x2="3" y1="12" y2="12" />
          <line x1="21" x2="16" y1="20" y2="20" />
          <line x1="12" x2="3" y1="20" y2="20" />
          <line x1="14" x2="14" y1="2" y2="6" />
          <line x1="8" x2="8" y1="10" y2="14" />
          <line x1="16" x2="16" y1="18" y2="22" />
        </svg>
      </button>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model="productsStore.getFilters"
        :categories="categories"
        :materials="materials"
        :seasons="seasons"
        :colors="colors"
        @update="updateFilter"
        @reset="clearFilter"
      />
      <section class="catalog">
        <div class="content__uikit">
          <base-loader v-if="!resolved" />

          <div v-if="isLoadingFaild" class="catalog__error">
            <div class="catalog__error-container">
              <p class="catalog__error-descr">
                Произошла ошибка при загрузке товаров
              </p>
              <button
                @click="() => updateProducts"
                class="button button--primery"
              >
                Попробовать снова
              </button>
            </div>
          </div>

          <p v-if="products.length === 0 && resolved">
            К сожалению, товары отсутствуют.
          </p>
        </div>

        <ProductList :products="products" />

        <Base-Pagination
          :path="route.path"
          :total-pages="totalPages"
          :query="route.query"
          @update="updatePage"
        />
      </section>
    </div>

    <ProductFilterMobile
      v-if="showMobFilter"
      v-model="productsStore.getFilters"
      :categories="categories"
      :materials="materials"
      :seasons="seasons"
      :colors="colors"
      @update="updateFilter"
      @reset="clearFilter"
      @close="closeFilter"
    />
  </main>
</template>

<style lang="scss" scoped>
.catalog__error {
  text-align: center;
}

.content__uikit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  &__mob-filter-btn {
    display: none;
  }
}

@media (max-width: 1024px) {
  .content {
    &__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__mob-filter-btn {
      display: block;
      background: white;
      border: none;
      cursor: pointer;
      transition: none 0.3s ease-in-out;

      & svg {
        transition: none 0.3s ease-in-out;
      }

      &:hover svg,
      &:focus svg,
      &:active svg {
        stroke: #9d9d9d;
      }
    }
  }
}
</style>
