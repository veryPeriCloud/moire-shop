<template>
  <main class="content container">
    <p class="not-found">
      404
    </p>
    <p class="not-found__text">
      Упс!
    </p>
    <p class="not-found__text">
      Страница не найдена :(
    </p>
    <p class="">
      <router-link to="/" class="button button--primery">
        Вернуться на главную страницу
      </router-link>
    </p>
  </main>
</template>

<style scoped>
.content {
  text-align: center;
}
.not-found {
  margin: 0;
  margin-bottom: 20px;
  font-size: 120px;
  font-weight: bold;
}

.not-found__text {
  margin: 0;
  margin-bottom: 20px;
}
</style>
