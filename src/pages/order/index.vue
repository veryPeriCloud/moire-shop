<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/order";
import { useNumberFormat } from "@/composables/format";
import { API_BASE_URL } from "@/../config.js";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import OrderCartItem from "@/components/order/OrderCartItem.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import BaseRadioButton from "@/components/ui/BaseRadioButton.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const formData = reactive({
  name: "",
  address: "",
  phone: "",
  email: "",
  deliveryTypeId: 0,
  paymentTypeId: 0,
  comment: ""
});

const rules = computed(() => {
  return {
    formData: {
      name: {
        required,
        minLength: minLength(8),
      },
      address: {
        required,
        minLength: minLength(8),
      },
      phone: {
        required,
        minLength: minLength(11),
      },
      email: {
        required,
        email,
        minLength: minLength(4),
      },
    },
  };
});

const v$ = useVuelidate(rules, { formData });

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();
const products = computed(() => cartStore.cartDetailProducts);

await orderStore.fetchDeliveries();
const deliveries = computed(()=> orderStore.getDeliveries);
const payments = ref([]);
let deliveryCost = ref(0);
const isOrderFailed = ref(false);

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
  }
});

const createOrder = async () => {
  try {
    await orderStore.createOrder(formData)
      .then(()=>{
        router.push({ name: 'order-processed'})
      })
  }
  catch (e) {
    console.log(e);
    isOrderFailed.value = true;
  }
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
              v-model="v$.formData.name.$model"
              placeholder="Введите ваше полное имя"
              :error="v$.formData.name" title="ФИО" />
            <base-input
              v-model="v$.formData.address.$model"
              :error="v$.formData.address"
              placeholder="Введите ваш адрес"
              title="Адрес доставки" />
            <base-input
              v-model="v$.formData.phone.$model"
              :error="v$.formData.phone"
              placeholder="+7 999 999 99 99"
              title="Телефон" />
            <base-input
              v-model="v$.formData.email.$model"
              :error="v$.formData.email"
              placeholder="Введи ваш Email"
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
            :disabled="v$.$invalid || formData.deliveryTypeId === 0 || formData.paymentTypeId === 0"
          >
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="isOrderFailed">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>