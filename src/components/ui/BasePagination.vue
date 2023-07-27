<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  count: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 1,
  }
});
const emits = defineEmits(['update:modelValue']);

const pages = computed(()=> Math.ceil(props.count / props.perPage));

const paginate = (page) => {
  emits('update:modelValue', page);
}
const prevPage = (page) => {
  emits('update:modelValue', page - 1);
}
const nextPage = (page) =>{
  emits('update:modelValue', page + 1);
}
</script>

<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': props.modelValue <= 1}"
        aria-label="Предыдущая страница"
        @click.prevent="prevPage(props.modelValue)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a class="pagination__link" 
        :class="{'pagination__link--current': pageNumber === props.modelValue}"
        @click.prevent="paginate(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': props.modelValue >= pages}"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="nextPage(props.modelValue)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.pagination__link {
  cursor: pointer;
}

.pagination__link--disabled {
  pointer-events: none;
}
</style>
