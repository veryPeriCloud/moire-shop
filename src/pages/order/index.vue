<script setup lang="ts">
import { computed, reactive, watch, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/order";
import { useNumberFormat } from "@/composables/format";
import { useRouter } from "vue-router";
import OrderCartItem from "@/components/order/OrderCartItem.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import BaseRadioButton from "@/components/ui/BaseRadioButton.vue";
import type { IOrderFormData } from "@/types/Order";

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const formData = reactive<IOrderFormData>({
  name: "",
  address: "",
  phone: "",
  email: "",
  deliveryTypeId: 0,
  paymentTypeId: 0,
  comment: "",
});

onMounted(async () => {
  try {
    await orderStore.fetchDeliveries();
  } catch (error) {
    console.log(error);
  }
});

const formError = computed(() => orderStore.getErrors);
const products = computed(() => cartStore.cartDetailProducts);

const deliveries = computed(() => orderStore.getDeliveries);
const deliveryCost = computed(() => {
  if (formData.deliveryTypeId !== 0) {
    return Number(deliveries.value.find((item) => item.id === formData.deliveryTypeId).price);
  } else return 0;
});

watch(formData, async () => {
  if (formData.deliveryTypeId !== 0) {
    await orderStore.fetchPayments(formData.deliveryTypeId);
  } else return;
});

const createOrder = async () => {
  await orderStore.createOrder(formData).then(() => {
    router.push({
      name: "order-info",
      params: { id: orderStore.orderInfo.id },
    });
  });
};
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{ name: 'home' }" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{ name: 'cart' }" class="breadcrumbs__link">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" method="POST" @submit.prevent="createOrder">
        <div class="cart__field">
          <div class="cart__data">
            <base-input
              v-model="formData.name"
              placeholder="Введите ваше полное имя"
              :error="formError !== null ? formError.name : undefined"
            />
            <base-input
              v-model="formData.address"
              placeholder="Введите ваш адрес"
              :error="formError !== null ? formError.address : undefined"
              title="Адрес доставки"
            />
            <base-input
              v-model="formData.phone"
              placeholder="+7 999 999 99 99"
              :type="'tel'"
              :error="formError !== null ? formError.phone : undefined"
              title="Телефон"
            />
            <base-input
              v-model="formData.email"
              placeholder="Введи ваш Email"
              :error="formError !== null ? formError.email : undefined"
              title="Email"
            />
            <base-textarea
              v-model="formData.comment"
              placeholder="Ваши пожелания"
              title="Комментарий к заказу"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <base-radio-button
                v-for="delivery in deliveries"
                :key="delivery.id"
                :option="delivery"
                name="delivery"
                v-model.number="formData.deliveryTypeId"
              />
            </ul>

            <h3 class="cart__title" v-if="orderStore.getPayments">Оплата</h3>
            <ul class="cart__options options">
              <base-radio-button
                v-for="payment in orderStore.getPayments"
                :key="payment.id"
                :option="payment"
                name="payment"
                v-model.number="formData.paymentTypeId"
              />
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <order-cart-item
              v-for="product in products"
              :key="product.id"
              :item="product"
            />
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ deliveryCost }}</b>
            </p>
            <p>
              Итого: <b>{{ products.length }}</b> товара на сумму
              <b
                >{{
                  useNumberFormat(cartStore.getCartTotalSumm + Number(deliveryCost))
                }}&nbsp;₽</b
              >
            </p>
          </div>

          <button
            class="cart__button button button--primery"
            type="submit"
            :disabled="
              formData.deliveryTypeId === 0 || formData.paymentTypeId === 0
            "
          >
            Оформить заказ
          </button>
        </div>
        <div
          class="cart__error form__error-block"
          v-if="orderStore.formErrorMessage"
        >
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ orderStore.formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.cart__field {
  width: 100%;
}
@media (max-width:640px) {
  .options {
    grid-template-columns: 1fr;
  }

  .cart {
    &__data {
      grid-template-columns: 1fr;
      grid-gap: 20px;
    }
  }
}
</style>