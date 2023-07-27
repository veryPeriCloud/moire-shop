<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import ProductFilter from "@/components/catalog/ProductFilter.vue";
import ProductList from "@/components/catalog/ProductList.vue";
import BasePagination from "@/components/ui/BasePagination.vue";
import axios from "axios";

const resolved = ref(false);

const productsData = ref(null);
const page = ref(1);
const productsPerPage = 6;

const filterCategoryId = ref(0);
const filter = reactive({
  priceFrom: 0,
  priceTo: 0,
  categoryId: 0,
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
  await axios.get('https://vue-moire.skillbox.cc/api/products', {
    params: {
      page: page.value,
      limit: productsPerPage,
      minPrice: filter.priceFrom,
      maxPrice: filter.priceTo,
      categoryId: filter.categoryId,
    }
  })
    .then((response) => {
      // console.log(response.data)
      productsData.value = response.data;
    })
    .then(() => resolved.value = true)
}

const updateFilter = (d) => {
  filter.priceFrom = d.priceFrom;
  filter.priceTo = d.priceTo;
}

onMounted(async ()=> {
  await fetchProducts()
})
watch(page, async ()=> {
  await fetchProducts()
})

watch(filter, async ()=> {
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
      />

      <section class="catalog" v-if="resolved">
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

</style>
