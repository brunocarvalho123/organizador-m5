<template>
  <div class="header-div">
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="40"/>
    </div>

    <v-spacer></v-spacer>

    <div class="teste">
      <v-text-field
        color="white"
        class="search-bar"
        label="Pesquisar elementos"
        append-icon="mdi-magnify">
      </v-text-field>
    </div>


    <v-spacer></v-spacer>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
</template>

<style scoped>
  .header-div {
    display: flex;
    background-color: var(--org-blue);
    padding-left: 25px;
    padding-right: 25px;
  }
  .search-bar .v-icon {
    color: var(--org-blue) !important;
  }
  .teste {
    width: 35%;
    margin-top: 10px;
  }
</style>

<script>
  export default {
    name: 'Header',

    data: () => ({
    }),
  }
</script>
