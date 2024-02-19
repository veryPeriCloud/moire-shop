<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  totalPages: {
    type: Number,
    default: 0
  },
  query: {
    type: Object,
    default: () => {}
  }
});
const emit = defineEmits(['update']);
const currentPage = computed((): number => {
  return props.query.page !== undefined
    ? parseInt(props.query.page)
    : 1
});

const getPageUrl = (page: number) => {
  let q = JSON.parse(JSON.stringify(props.query));
  q.page = page;
  return (
    props.path +
    "?" +
    Object.keys(q)
      .map((key) => {
        return key + "=" + q[key];
      })
      .join("&")
  );
};
</script>

<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <router-link
        :to="getPageUrl(currentPage - 1)"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': currentPage <= 1}"
        aria-label="Предыдущая страница"
        @click.prevent="emit('update', currentPage - 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </router-link>
    </li>
    <li class="pagination__item"
      v-for="pageNumber in props.totalPages"
      :key="pageNumber"
    >
      <router-link
        :to="getPageUrl(pageNumber)"
        class="pagination__link" 
        :class="{'pagination__link--current': pageNumber === currentPage}"
        @click.prevent="emit('update', pageNumber)"
      >
        {{ pageNumber }}
      </router-link>
    </li>
    <li class="pagination__item">
      <router-link
        :to="getPageUrl(currentPage + 1)"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': currentPage >= totalPages}"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="emit('update', currentPage + 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </router-link>
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
