<script setup lang="ts">
import { computed } from "vue";
import { useNumberFormat } from "@/composables/format";

const props = defineProps<{
  item: ICartDetailProduct;
}>();

const itemTotalPrice = computed(() => props.item.price * props.item.quantity);
</script>

<template>
  <li class="cart__order">
    <h3>{{ props.item.product.title }}</h3>
    <b>{{ useNumberFormat(itemTotalPrice) }} ₽</b>
    <span>Артикул: {{ props.item.product.id }}</span>
  </li>
</template>