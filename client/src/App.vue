<template>
  <v-app>
    <Header/>
    <router-view/>
  </v-app>
</template>



<script>
  import Header from './components/Header';

  export default {
    name:'app',
    components: {
      Header
    }
  }

</script>

<style>
  @import './theme/variables.css';
</style>