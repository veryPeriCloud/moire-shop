<script setup lang="ts">
import { computed } from "vue";
import CartItem from "@/components/cart/CartItem.vue";
import { useCartStore } from "@/stores/cart";
import { useNumberFormat } from "@/composables/format";

const cartStore = useCartStore();
const cartProducts = computed(() => cartStore.cartDetailProducts);

</script>

<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'home'}">
            Каталог
          </router-link >
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ cartStore.cartProducts.length }} товар
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list" v-if="cartProducts.length > 0">
            <Cart-Item
              v-for="item in cartProducts"
              :key="item.id"
              :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ useNumberFormat(cartStore.getCartTotalSumm) }} ₽</span>
          </p>

          <router-link :to="{name: 'order'}" v-slot="{ href, navigate }">
            <button :href="href" class="cart__button button button--primery"
              type="submit"
              @click="navigate"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>