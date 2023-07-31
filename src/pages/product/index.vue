<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { API_BASE_URL } from "@/../config.js";
import axios from "axios";
import { useNumberFormat } from "@/composables/format";
import BaseLoader from "@/components/ui/BaseLoader.vue";

const resolved = ref(false);
const isLoadingFaild = ref(false);
const productData = ref(null);
const route = useRoute();
const currentTab = ref("info");
const currentProductColor = ref(null);
const tabs = [
  { name: "Информация о товаре", code: "info" },
  { name: "Доставка и возврат", code: "delivery" },
];

const changeTab = (item) => {
  currentTab.value = item.code
}

const formData = reactive({
  productId: 0,
  colorId: 0,
  sizeId: 0,
  quantity: 1,
})

const fetchProduct = async() => {
  axios.get(`${API_BASE_URL}/api/products/${route.params.slug}`)
    .then((response) =>  {productData.value = response.data; })
    .catch(() => { isLoadingFaild.value = true; })
    .then(() => { resolved.value = true; });
}

const product = computed(() => productData.value ? productData.value : {});
await fetchProduct();

const pic = computed(()=> {  
  if (currentProductColor.value === null) {
    return product.value.colors[0].gallery ?  product.value.colors[0].gallery[0].file.url : '../img/empty.jpg';
  } else {
    return currentProductColor.value.gallery ? currentProductColor.value.gallery[0].file.url : "../img/empty.jpg";
  }
})

const addToCart = () => {
  console.log('add to cart')
}

</script>

<template>
  <div class="content container center" v-if="!resolved">
    <base-loader />
  </div>
  <div class="content container" v-if="isLoadingFaild">Произошла ошибка при загрузке товара</div>

  <main class="content container" v-if="resolved">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'home'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'home'}">
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
        <!-- to change main image when click on change color-->
        <div class="pics__wrapper">
          <img width="570" height="570"
            :src="pic"
            :alt="product ? product.title : null ">
        </div>
        <ul class="pics__list" v-if="product.colors.length > 1">
          <li class="pics__item" v-for="(color, index) in product.colors" :key="index">
            <a class="pics__link"
              :class="{'pics__link--current' : currentProductColor===color}"
              @click.prevent="currentProductColor=color"
            >
              <img width="98" height="98" 
                :src="color.gallery ? color.gallery[0].file.url : '../img/empty.jpg'"
                :alt="product.title"
              >
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
          <form class="form" action="#" method="POST"
            @submit.prevent="addToCart"
          >
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" value="1" name="count">

                <button type="button" aria-label="Добавить один товар">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>
              
              <b class="item__price">
                {{ useNumberFormat(product.price) }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item"
                    v-for="color in product.colors"
                    :key="color.id"
                  >
                    <label class="colors__label">
                      <input class="colors__radio sr-only"
                        type="radio"
                        name="color-1"
                        :value="color.color.code"
                        v-model="formData.colorId"
                        @input="currentProductColor=color"
                      >
                      <span class="colors__value" :style="{'background-color': color.color.code}">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>


              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" name="category" v-model="product.size">
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
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item"
            v-for="(item, index) in tabs"
            :key="index"
          >
            <button class="tabs__link btn-reset"
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
              Машинная стирка при макс. 30ºC короткий отжим<br>
              Гладить при макс. 110ºC<br>
              Не использовать машинную сушку<br>
              Отбеливать запрещено<br>
              Не подвергать химчистке<br>
            </p>
          </div>
          <div v-else>
            <h3>Доставка</h3>
            <p>Доставка осуществляется через транспортную компанию СДЭК или почтой России.</p>
            <p>Стоимость доставки от 299 руб.</p>
            <h3>Возврат</h3>
            <p>Довар можно вернуть в течение 14 дней после получения товара в 
              Вы можете вернуть или обменять товар, купленный в интернет-магазине в течение 14 дней после покупки. 
              В случае обнаружения производственного брака в приобретенном товаре, вы можете вернуть его нам в течение 30 дней с момента покупки.
              Как вернуть товар, если дефектов нет

              Не пользуйтесь покупкой, не нарушайте пломбы и фабричные ярлыки.

              Проверьте, подлежит ли товар обмену и возврату, предварительно связавшись с менеджером.

              Проверьте, сохранился ли чек.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.center {
  text-align: center;
}

.pics__link {
  display: inline-block;
  height: 100%;

  img {
    height: 100%;
  }
}

.btn-reset {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>
