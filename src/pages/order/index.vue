<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/order";
import { useNumberFormat } from "@/composables/format";
import { API_BASE_URL } from "@/assets/ts/config";
import { useRouter } from "vue-router";
import OrderCartItem from "@/components/order/OrderCartItem.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import BaseRadioButton from "@/components/ui/BaseRadioButton.vue";
import axios from "axios";


const formData = reactive({
  name: "",
  address: "",
  phone: "",
  email: "",
  deliveryTypeId: 0,
  paymentTypeId: 0,
  comment: ""
});

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const payments = ref([]);
let deliveryCost = ref(0);

const formError = computed(() => orderStore.getErrors);
const products = computed(() => cartStore.cartDetailProducts);

await orderStore.fetchDeliveries();
const deliveries = computed(()=> orderStore.getDeliveries);
let orderTotalSumm = computed(() => cartStore.getCartTotalSumm);

const fetchPayments = async() => {
  await axios.get(`${API_BASE_URL}/api/payments`, {
    params: {
      deliveryTypeId: formData.deliveryTypeId
    }
  })
  .then((res) => {
    payments.value = res.data
  })
}

// Todo - too much requests!
watch(formData, async () => {
  if (formData.deliveryTypeId !== 0) {
    
    await fetchPayments();
    deliveryCost = computed(() => {
      return Number(deliveries.value.find((item) => item.id === formData.deliveryTypeId).price);
    });
    orderTotalSumm = computed(() => {
      if (deliveryCost.value === 0) {
        return cartStore.getCartTotalSumm + Number(deliveryCost.value);
      }
      else {
        return cartStore.getCartTotalSumm + Number(deliveryCost.value);
      }
    })
  } else return
});

const createOrder = async () => {
  await orderStore.createOrder(formData)
    .then(() => {
      router.push({ name: 'order-info', params: {id: orderStore.orderInfo.id}})
    })
}

</script>

<template>
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

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form"
        method="POST"
        @submit.prevent="createOrder"
      >
        <div class="cart__field">
          <div class="cart__data">
            <base-input
              v-model="formData.name"
              placeholder="Введите ваше полное имя"
              :error="formError.name" />
            <base-input
              v-model="formData.address"
              placeholder="Введите ваш адрес"
              :error="formError.address"
              title="Адрес доставки" />
            <base-input
              v-model="formData.phone"
              placeholder="+7 999 999 99 99"
              :type="'tel'"
              :error="formError.phone"
              title="Телефон" />
            <base-input
              v-model="formData.email"
              placeholder="Введи ваш Email"
              :error="formError.email"
              title="Email" />
            <base-textarea
              v-model="formData.comment"
              placeholder="Ваши пожелания"
              title="Комментарий к заказу" />
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

            <h3 class="cart__title" v-if="payments.length > 0">Оплата</h3>
            <ul class="cart__options options">
              <base-radio-button
                v-for="payment in payments"
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
            <p>Доставка: <b>{{ deliveryCost }}</b></p>
            <p>Итого: <b>{{ products.length }}</b> товара на сумму <b>{{ useNumberFormat(orderTotalSumm) }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit"
            :disabled="formData.deliveryTypeId === 0 || formData.paymentTypeId === 0"
          >
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="orderStore.formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ orderStore.formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>@/config.js