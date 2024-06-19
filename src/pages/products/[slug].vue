<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useProductsStore } from "@/stores/products";
import { useNumberFormat } from "@/composables/format";
import BaseLoader from "@/components/ui/BaseLoader.vue";
import BaseCounter from "@/components/ui/BaseCounter.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import type { ITab, IProductFormData } from "@/pages/product/productTypes.d.ts";

const resolved = ref(false);
const isLoadingFaild = ref(false);
const currentTab = ref("info");
const currentProductColor = ref(null);
const error = ref(false);
const showModal = ref(false);

const route = useRoute();
const cartStore = useCartStore();
const productsStore = useProductsStore();

const tabs: ITab[] = [
  { name: "Информация о товаре", code: "info" },
  { name: "Доставка и возврат", code: "delivery" },
];

const changeTab = (item: ITab) => {
  currentTab.value = item.code;
};

const formData = reactive<IProductFormData>({
  productId: 0,
  colorId: 0,
  sizeId: 0,
  quantity: 1,
});

onBeforeMount(async () => {
  const slug = route.params.slug;
  await productsStore
    .fetchProduct(slug as string)
    .then(() => (resolved.value = true))
    .catch(() => (isLoadingFaild.value = true));
});
const product = computed(() => productsStore.getProduct);

const pic = computed(() => {
  if (currentProductColor.value === null && product.value) {
    return product.value.colors[0].gallery
      ? product.value.colors[0].gallery[0].file.url
      : "../img/empty.jpg";
  } else {
    return currentProductColor.value.gallery
      ? currentProductColor.value.gallery[0].file.url
      : "../img/empty.jpg";
  }
});

const addToCart = async () => {
  formData.productId = product.value.id;

  if (formData.sizeId !== 0 && formData.colorId !== 0) {
    error.value = false;
    await cartStore.addProductToCart(formData).then(() => {
      showModal.value = true;
    });
  } else {
    error.value = true;
  }
};
</script>

<template>
  <div class="content container center" v-if="!resolved">
    <base-loader />
  </div>
  <div class="content container" v-if="isLoadingFaild">
    Произошла ошибка при загрузке товара
  </div>

  <main class="content container" v-if="product !== null && resolved">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'home' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'home' }">
            {{ product.category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>
    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img :src="pic" :alt="product ? product.title : ''" />
        </div>
        <ul class="pics__list" v-if="product.colors.length > 1">
          <li
            class="pics__item"
            v-for="(color, index) in product.colors"
            :key="index"
          >
            <a
              class="pics__link"
              :class="{ 'pics__link--current': currentProductColor === color }"
              @click.prevent="currentProductColor ? color : null"
            >
              <img
                width="98"
                height="98"
                :src="
                  color.gallery ? color.gallery[0].file.url : '../img/empty.jpg'
                "
                :alt="product.title"
              />
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart"
          >
            <div class="item__row item__row--center">
              <base-counter v-model.number="formData.quantity" />

              <b class="item__price">
                {{ useNumberFormat(product.price) }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li
                    class="colors__item"
                    v-for="color in product.colors"
                    :key="color.id"
                  >
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-1"
                        :value="color.color.id"
                        v-model="formData.colorId"
                        @input="currentProductColor ? color : null"
                      />
                      <span
                        class="colors__value"
                        :style="{ 'background-color': color.color.code }"
                      >
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label
                  class="form__label form__label--small form__label--select"
                >
                  <select
                    class="form__select"
                    name="category"
                    v-model="formData.sizeId"
                  >
                    <option
                      v-for="size in product.sizes"
                      :key="size.id"
                      :value="size.id"
                    >
                      {{ size.title }}
                    </option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit">
              В корзину
            </button>
            <p v-if="error">Выберите, пожалуйста, цвет и размер товара.</p>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item" v-for="(item, index) in tabs" :key="index">
            <button
              class="tabs__link btn-reset"
              :class="{ 'tabs__link--current': currentTab === item.code }"
              @click.prevent="changeTab(item)"
            >
              {{ item.name }}
            </button>
          </li>
        </ul>

        <div class="item__content">
          <div v-if="currentTab === 'info'">
            <h3>Состав:</h3>
            <p>
              {{ product.materials[0].title }}
            </p>

            <h3>Уход:</h3>

            <p>
              Машинная стирка при макс. 30ºC короткий отжим<br />
              Гладить при макс. 110ºC<br />
              Не использовать машинную сушку<br />
              Отбеливать запрещено<br />
              Не подвергать химчистке<br />
            </p>
          </div>
          <div v-else>
            <h3>Доставка</h3>
            <p>
              Доставка осуществляется через транспортную компанию СДЭК или
              почтой России.
            </p>
            <p>Стоимость доставки от 299 руб.</p>
            <h3>Возврат</h3>
            <p>
              Довар можно вернуть в течение 14 дней после получения товара в Вы
              можете вернуть или обменять товар, купленный в интернет-магазине в
              течение 14 дней после покупки. В случае обнаружения
              производственного брака в приобретенном товаре, вы можете вернуть
              его нам в течение 30 дней с момента покупки. Как вернуть товар,
              если дефектов нет Не пользуйтесь покупкой, не нарушайте пломбы и
              фабричные ярлыки. Проверьте, подлежит ли товар обмену и возврату,
              предварительно связавшись с менеджером. Проверьте, сохранился ли
              чек.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <teleport to="body">
    <base-modal :show="showModal">
      <template #body>
        <p>Довар добавлен в корзину</p>
      </template>
      <template #footer>
        <router-link class="button button--second" :to="{ name: 'cart' }"
          >Перейти в корзину</router-link
        >
        <button
          class="button button--primery button--tocart"
          @click.prevent="showModal = false"
        >
          OK
        </button>
      </template>
    </base-modal>
  </teleport>
</template>

<style lang="scss" scoped>
.center {
  text-align: center;
}

.pics {
  &__link {
    display: inline-block;
    height: 100%;

    img {
      height: 100%;
    }
  }
}

.btn-reset {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.form {
  &__select {
    border: 1px solid #e2e2e2;
  }
}

@media (max-width:768px) {
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
