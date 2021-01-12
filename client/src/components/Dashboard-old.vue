<template>
  <v-container fluid>
    <v-list class="colabs-list">
      <template v-for="(item,index) in testes">
        <v-divider
          class = "divider"
          v-if="item.divider"
          :key="index"
          :inset="item.inset">
        </v-divider>

        <v-list-item v-else :key="item.title">
          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar>
            <img :src="item.avatar">
          </v-list-item-avatar>
        </v-list-item>

      </template>
    </v-list>

    <v-text-field label="teste 2"></v-text-field>
  </v-container>
</template>

<style>
  .colabs-list {
    width: 25%;
    margin-left: 0px;
  }
  .divider {
    border-color: black !important;
    border-width: 1px !important;
  }
</style>

<script>
  export default {
    name: 'Dashboard',

    data: () => ({
      testes: [
        { divider: true, inset: false },
        { title: 'Bruno Carvalho', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
        { divider: true, inset: false },
        { title: 'Travis Howard', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
        { divider: true, inset: false },
        { title: 'Ali Connors', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
        { divider: true, inset: false },
        { title: 'Cindy Baker', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
        { divider: true, inset: false }
      ]
    }),
  }
</script>
