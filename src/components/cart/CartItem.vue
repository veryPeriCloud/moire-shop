<script setup lang="ts">
import BaseCounter from "@/components/ui/BaseCounter.vue";
import { useNumberFormat } from "@/composables/format";
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";
import type { ICartProductDataWithImg } from "@/types/Cart";

const cartStore = useCartStore();
const props = defineProps<{
  item: ICartProductDataWithImg;
}>();

const amount = computed({
  get() {
    return props.item.quantity;
  },
  set(value) {
    cartStore.updateCartProductAmount({
      basketItemId: props.item.id,
      quantity: value,
    });
  },
});

const deleteProduct = async (id: number): Promise<void> => {
  await cartStore.deleteCartProduct(id);
  await cartStore.fetchCart();
};
</script>

<template>
  <li class="cart__item product" v-if="props.item">
    <div class="product__pic">
      <img
        :src="props.item.image"
        width="120"
        height="120"
        :alt="props.item.product.title"
      />
    </div>
    <div>
      <h3 class="product__title">
        {{ props.item.product.title }}
      </h3>
      <p class="product__size">размер: {{ props.item.size.title }}</p>
    </div>

    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{ 'background-color': props.item.color.color.code }"></i>
        {{ props.item.color.color.title }}
      </span>
    </p>
    <span class="product__code"> Артикул: {{ props.item.id }} </span>

    <base-counter v-model.number="amount" />

    <b class="product__price">
      {{ useNumberFormat(props.item.price * props.item.quantity) }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(props.item.id)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<style lang="scss" scoped>
.product {
  &__title {
    font-weight: 600;
  }

  &__size{
    margin: 0;
    margin-top: 10px;
  }
}
.button-del {
  cursor: pointer;
}

.button-del:hover svg {
  color: #9d9d9d;
}

.button-del:hover svg {
  color: #e02d71;
}
</style>
