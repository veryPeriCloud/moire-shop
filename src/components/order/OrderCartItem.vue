<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: false,
  }
})
</script>

<template>
  <li class="cart__order">
    <h3>{{ props.item.product.title }}</h3>
    <b>{{ props.item.price }} ₽</b>
    <span>Артикул: {{ props.item.productId }}</span>
  </li>
</template>