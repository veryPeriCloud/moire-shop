<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from "vue";
import { API_BASE_URL } from "@/../config.js";
import axios from "axios";

type FormData = {
  priceFrom: Number,
  priceTo: Number,
  categoryId: Number,
  materialIds: Array<Number>,
  seasonIds: Array<Number>,
  colorIds: Array<Number>,
}
const formData: FormData = reactive({
  priceFrom: 0,
  priceTo: 0,
  categoryId: 0,
  materialIds: [],
  seasonIds: [],
  colorIds: [],
})

const categoriesData = ref(null);
const materialsData = ref(null);
const seasonsData = ref(null);
const colorsData = ref(null);

const emit = defineEmits(['update', 'reset']);

const fetchCategories = async() => {
  axios.get(`${API_BASE_URL}/api/productCategories`)
    .then((response) => { categoriesData.value = response.data; });
}
const fetchMaterial = async() => {
  axios.get(`${API_BASE_URL}/api/materials`)
    .then((response) => { materialsData.value = response.data; });
}
const fetchSeasons = async() => {
  axios.get(`${API_BASE_URL}/api/seasons`)
    .then((response) => { seasonsData.value = response.data; });
}
const fetchColors = async() => {
  axios.get(`${API_BASE_URL}/api/colors`)
    .then((response) => { colorsData.value = response.data; });
}

onMounted(async()=>{
  await fetchCategories();
  await fetchMaterial();
  await fetchSeasons();
  await fetchColors();
})

const categories = computed(() => {
  return categoriesData.value ? categoriesData.value.items : [];
})
const materials = computed(() => {
  return materialsData.value ? materialsData.value.items : [];
})
const seasons = computed(() => {
  return seasonsData.value ? seasonsData.value.items : [];
})
const colors = computed(() => {
  return colorsData.value ? colorsData.value.items : [];
})

const submit = () => {
  emit('update', formData);
}
const reset = () => {
  emit('reset', {
    priceFrom: 0,
    priceTo: 0,
    categoryId: 0,
    materialIds: [],
    seasonIds: [],
    colorIds: [],
  });
  formData.priceFrom = 0;
  formData.priceTo = 0;
  formData.categoryId = 0;
  formData.materialIds = [];
  formData.colorIds = [];
  formData.seasonIds = []

}
</script>

<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" 
            v-model="formData.priceFrom"
          >
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price"
            v-model="formData.priceTo"
          >
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" name="category" v-model="formData.categoryId">
            <option value="0">Все категории</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item"
            v-for="color in colors"
            :key="color.id"
          >
            <label class="colors__label">
              <input class="colors__check sr-only"
                type="checkbox"
                name="collection"
                checked=""
                :value="color.id"
                v-model="formData.colorIds"
              >
              <span class="colors__value" :style="{ backgroundColor: color.code}"></span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">          
          <li class="check-list__item"
            v-for="material in materials"
            :key="material.id"            
          >
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="material"
                :value="material.id"
                v-model="formData.materialIds"
              >
              <span class="check-list__desc">
                {{ material.title }} 
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                checked=""
                :value="season.id"
                v-model="formData.seasonIds"
              >
              <span class="check-list__desc">
                {{ season.title }} 
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button class="filter__reset button button--second" type="button"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<style>
.colors__label:focus .colors__value::before, 
.colors__label:hover .colors__value::before, 
.colors__check:checked~.colors__value::before {
  border-color: #e02d71;
}
</style>