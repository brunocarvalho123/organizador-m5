<template>
  <div class="header-div">
    <div class="d-flex left-bar">
      <v-img
          alt="Vuetify Logo"
          class="shrink mr-2 logo"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"/>
    </div>

    <v-spacer></v-spacer>

    <div class="middle-bar">
      <v-text-field
        dark
        class="search-bar"
        label="Pesquisar elementos"
        append-icon="mdi-magnify">
      </v-text-field>
    </div>


    <v-spacer></v-spacer>
    <router-link to="/">Home</router-link> |
    <router-link to="/area">Area</router-link>
  </div>
</template>

<style scoped>
  .header-div {
    display: flex;
    background-color: var(--org-blue);
    padding-left: 25px;
    padding-right: 25px;
    height: 75px;
    box-shadow: 1px 1px 8px 1px #888888;
    overflow: hidden;
  }
  .middle-bar {
    width: 30%;
    transform: scale(0.9);
    margin-top: 10px;
  }
  .left-bar {
    width: 23%;
    height: 140%;
    margin-left: -70px;
    margin-top: -15px;
    background-color: white;
    border-radius: 60px;
  }
  .logo {
    margin-left: 80%;
  }
</style>

<script>
  export default {
    name: 'OrgHeader',

    data: () => ({
    }),
  }
</script>
