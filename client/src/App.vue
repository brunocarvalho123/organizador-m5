<template>
  <v-app>
    <OrgHeader/>
    <router-view/>
  </v-app>
</template>



<script>
  import OrgHeader from './components/OrgHeader';

  export default {
    name:'app',
    components: {
      OrgHeader
    }
  }

</script>

<style>
  @import './theme/variables.css';
</style>