<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductFilter from "@/components/catalog/ProductFilter.vue";
import ProductList from "@/components/catalog/ProductList.vue";
import BasePagination from "@/components/ui/BasePagination.vue";
import BaseLoader from "@/components/ui/BaseLoader.vue";
import { useProductsStore } from "@/stores/products";
import { useRoute, useRouter } from "vue-router";
import type { IFilter, IProductColors, IProductSeasons, IProductMaterials, IProductCategory } from "@/types/Products.d.ts";

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const resolved = ref(false);
const isLoadingFaild = ref(false);

const products = computed(() => productsStore.getProducts);
const countOfProducts = computed(() => productsStore.getProductsCount);
const totalPages = computed(() => productsStore.getTotalPages);

const categories = computed((): IProductCategory[] => productsStore.getCategories);
const materials = computed((): IProductMaterials[] => productsStore.getMaterials);
const seasons = computed((): IProductSeasons[] => productsStore.getSeasons);
const colors = computed((): IProductColors[] => productsStore.getColors);

onMounted(async()=> {
  try {
    productsStore.setFilters(route.query);
    productsStore.setCatalogFilter(route.query);
  } catch (error) {
    console.log(error);
  }
  await productsStore.fetchProducts()
    .then(() => resolved.value = true)
    .catch(() => isLoadingFaild.value = true);

  await productsStore.fetchCategories();
  await productsStore.fetchMaterials();
  await productsStore.fetchSeasons();
  await productsStore.fetchColors();
})

const updateFilter = async (filters: IFilter): Promise<void>  => {
  productsStore.setCatalogFilter(filters);
  productsStore.setPageFilter(1);
  await updateProducts(productsStore.getFilters);
}

const clearFilter = async (): Promise<void>  => {
  productsStore.clearFilters();
  await updateProducts(productsStore.getFilters);
}

const updatePage = async (page: number): Promise<void> => {
  productsStore.setPageFilter(page);
  await updateProducts(productsStore.getFilters);
}

const updateProducts = async (filters: IFilter): Promise<void> =>{
  resolved.value = false;

  productsStore.setFilters(filters);
  router.push(route.path + "?" + productsStore.getFiltersAsUrl);
  await productsStore.fetchProducts()
    .then(() => resolved.value = true);
}

</script>

<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
          <span class="content__info">
            {{ countOfProducts }} товаров
          </span>
      </div>
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
              <p class="catalog__error-descr">Произошла ошибка при загрузке товаров</p>
              <button @click="() => updateProducts" class="button button--primery">Попробовать снова</button>
            </div>
          </div>

          <p v-if="products.length === 0 && resolved" >
            К сожалению, товары отсутствуют.
          </p>
        </div>
        
        <ProductList :products="products"/>
        
        <Base-Pagination
          :path="route.path"
          :total-pages="totalPages"
          :query="route.query"
          @update="updatePage"
        />
      </section>
    </div>
  </main>
</template>

<style scoped>
.catalog__error {
  text-align: center;
}

.content__uikit{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
