<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import ProductFilter from "@/components/catalog/ProductFilter.vue";
import ProductList from "@/components/catalog/ProductList.vue";
import BasePagination from "@/components/ui/BasePagination.vue";
import BaseLoader from "@/components/ui/BaseLoader.vue";
import { API_BASE_URL } from "@/../config.js";
import axios from "axios";

const resolved = ref(false);
const isLoadingFaild = ref(false);

const productsData = ref(null);
const page = ref(1);
const productsPerPage = 12;

const filter = reactive({
  priceFrom: 0,
  priceTo: 0,
  categoryId: 0,
  materialIds: [],
  seasonIds: [],
  colorIds: [],
})

const products = computed(() => {
  if (productsData.value === null) {
    return [];
  }
  return productsData.value.items.map((item: any) => {
    return {
      ...item,
      image: item.colors[0].gallery !== null ? item.colors[0].gallery[0].file.url : null,
    };
  })
});
const countOfProducts = computed(() => productsData.value ? productsData.value.pagination.total : 0);

const fetchProducts = async() => {
  resolved.value = false;
  await axios.get(`${API_BASE_URL}/api/products`, {
    params: {
      page: page.value,
      limit: productsPerPage,
      minPrice: filter.priceFrom,
      maxPrice: filter.priceTo,
      categoryId: filter.categoryId,
      materialIds: filter.materialIds,
      seasonIds: filter.seasonIds,
      colorIds: filter.colorIds,
    }
  })
    .then((response) => {
      productsData.value = response.data;
    })
    .then(() => resolved.value = true)
    .catch(() => isLoadingFaild.value = true)
}

const updateFilter = (d) => {
  filter.priceFrom = d.priceFrom;
  filter.priceTo = d.priceTo;
  filter.categoryId = d.categoryId;
  filter.materialIds = d.materialIds;
  filter.seasonIds = d.seasonIds;
  filter.colorIds = d.colorIds;
}

const clearFilter = (d) => {
  filter.priceFrom = 0;
  filter.priceTo = 0;
  filter.categoryId = 0;
  filter.materialIds = [];
  filter.seasonIds = [];
  filter.colorIds = [];
}

onMounted(async()=> {
  await fetchProducts()
})
watch(page, async()=> {
  await fetchProducts()
})

watch(filter, async()=> {
  await fetchProducts()
})

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
        @update="updateFilter"
        @reset="clearFilter"
      />       
      <section class="catalog">
        <div class="content__uikit">
          <base-loader v-if="!resolved" />

          <div v-if="isLoadingFaild" class="catalog__error">
            <div class="catalog__error-container">
              <p class="catalog__error-descr">Произошла ошибка при загрузке товаров</p>
              <button @click.prevent="fetchProducts" class="button button--primery">Попробовать снова</button>
            </div>
          </div>
        </div>
        <ProductList :products="products"/>
        
        <Base-Pagination
          v-model="page"
          :count="countOfProducts"
          :per-page="productsPerPage"
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
