<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useOrderStore } from "@/stores/order";
import { useNumberFormat } from "@/composables/format";
import { useRoute } from "vue-router";
import type { IOrderInfo } from "@/types/Order";

const orderStore = useOrderStore();
const route = useRoute();

onMounted(async()=> {
  await orderStore.loadOrderInfo(route.params.id);
})
const orderInfo = computed<IOrderInfo | null>(()=> orderStore.getOrders);
const basket = computed(() => orderInfo.value ? orderInfo.value.basket.items : []);
</script>

<template>
  <Suspense>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'home'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ route.params.id}}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа. 
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary" v-if="orderInfo !== null">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in basket" :key="item.id">
              <h3>{{ item.product.title }}</h3>
              <b>{{ useNumberFormat(item.price * item.quantity) }} ₽</b>
              <span>Артикул: {{ item.product.id }}</span>
            </li>
          </ul>
          
          <div class="cart__total" v-if="orderInfo">
            <p>Доставка: <b>{{ useNumberFormat(orderInfo.deliveryType.price) }}</b></p>
            <p>Итого: <b>{{ basket.length }}</b> товара на сумму <b>{{ useNumberFormat(orderInfo.totalPrice) }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</Suspense>
</template>