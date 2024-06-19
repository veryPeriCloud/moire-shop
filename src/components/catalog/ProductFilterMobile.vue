<script setup lang="ts">
const props = defineProps<{
  modelValue: IFilter;
  categories: IProductCategory[];
  materials: IProductMaterials[];
  seasons: IProductSeasons[];
  colors: IProductColors[];
}>();

const emit = defineEmits<{
  (e: "update", value: IFilter): void;
  (e: "reset"): void;
  (e: "close"): void;
}>();

const submit = (): void => {
  emit("update", props.modelValue);
};

const reset = (): void => {
  emit("reset");
};
</script>

<template>
  <div class="overlay" @click="emit('close')"></div>
  <aside class="mob-filter">
    <div class="mob-filter__top">
      <h3 class="mob-filter__title">Фильтр</h3>
      <button
        class="product__del button-del"
        type="button"
        @click.prevent="emit('close')"
      >
        <svg width="20" height="20" fill="currentColor">
          <use xlink:href="#icon-close"></use>
        </svg>
      </button>
    </div>

    <form
      class="mob-filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <div class="form__fields">
        <fieldset class="form__block">
          <legend class="form__legend">Цена</legend>
          <label class="form__label form__label--price">
            <input
              class="form__input"
              type="text"
              name="min-price"
              v-model.number="modelValue.minPrice"
            />
            <span class="form__value">От</span>
          </label>
          <label class="form__label form__label--price">
            <input
              class="form__input"
              type="text"
              name="max-price"
              v-model.number="modelValue.maxPrice"
            />
            <span class="form__value">До</span>
          </label>
        </fieldset>

        <fieldset class="form__block">
          <legend class="form__legend">Категория</legend>
          <label class="form__label form__label--select">
            <select
              class="form__select"
              name="category"
              v-model="modelValue.categoryId"
            >
              <option value="0">Все категории</option>
              <option
                v-for="category in props.categories"
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
            <li
              class="colors__item"
              v-for="color in props.colors"
              :key="color.id"
            >
              <label class="colors__label">
                <input
                  class="colors__check sr-only"
                  type="checkbox"
                  name="collection"
                  :value="color.id"
                  v-model="modelValue.colorIds"
                />
                <span
                  class="colors__value"
                  :style="{ backgroundColor: color.code }"
                ></span>
              </label>
            </li>
          </ul>
        </fieldset>

        <fieldset class="form__block">
          <legend class="form__legend">Материал</legend>
          <ul class="check-list">
            <li
              class="check-list__item"
              v-for="material in props.materials"
              :key="material.id"
            >
              <label class="check-list__label">
                <input
                  class="check-list__check sr-only"
                  type="checkbox"
                  name="material"
                  :value="material.id"
                  v-model="modelValue.materialIds"
                />
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
            <li
              class="check-list__item"
              v-for="season in props.seasons"
              :key="season.id"
            >
              <label class="check-list__label">
                <input
                  class="check-list__check sr-only"
                  type="checkbox"
                  name="collection"
                  checked=""
                  :value="season.id"
                  v-model="modelValue.seasonIds"
                />
                <span class="check-list__desc">
                  {{ season.title }}
                  <span>({{ season.productsCount }})</span>
                </span>
              </label>
            </li>
          </ul>
        </fieldset>
      </div>

      <div class="form__buttons">
        <button class="filter__submit button button--primery" type="submit">
          Применить
        </button>
        <button
          class="filter__reset button button--second"
          type="button"
          @click.prevent="reset"
        >
          Сбросить
        </button>
      </div>
    </form>
  </aside>
</template>

<style lang="scss" scoped>
.colors__label:focus .colors__value::before,
.colors__label:hover .colors__value::before,
.colors__check:checked ~ .colors__value::before {
  border-color: #e02d71;
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: black;
  opacity: 0.5;
}

.mob-filter {
  background: white;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  height: 100vh;
  z-index: 10;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    margin: 0;
  }

  &__form {
    overflow: auto;
  }
}

.form {
  &__block {
    display: flex;
    gap: 10px;
  }

  &__fields {
    overflow: auto;
    height: calc(100vh - 44px - 107px);
  }

  &__buttons {
    display: flex;
    gap: 10px;
  }
}
.filter {
  &__submit {
    margin-bottom: 0;
  }
}
</style>
