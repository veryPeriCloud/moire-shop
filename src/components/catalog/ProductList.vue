<script setup lang="ts">
import ProductItem from "@/components/catalog/ProductItem.vue";

const props = defineProps<{
  products: IProduct[]
}>()
</script>

<template>
  <ul class="catalog__list">
    <ProductItem :product="product" v-for="product in props.products" :key="product.id"/>
  </ul>
</template>

<style scoped>
</style>
