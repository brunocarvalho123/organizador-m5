<template>
  <v-container v-if="search.loaded && originalSearchResults.length == 0" class="main-container">

    <div class="no-result-div">
      <p style="margin-bottom: 6vh;">Não foram econtrados resultados para <i><b>{{searchText}}</b></i></p>
      <v-icon color="var(--org-blue)" size=200>mdi-text-box-search</v-icon>
    </div>

  </v-container>
  <v-container v-else-if="search.loaded" class="main-container" fluid>

    <v-select v-model="selectedType" class="type-select" color="var(--org-blue)" :items="types" label="Tipo" @change="changeFilter"></v-select>

    <OrgTable class="search-table"
              height="78vh"
              :headers="search.headers"
              :items="search.results"
              search-path="true"/>

  </v-container>
  <v-container v-else class="spinner">
    <v-progress-circular
      indeterminate
      :size="120"
      :width="10"
      class="spinner"
      color="var(--org-blue)"
    ></v-progress-circular>
  </v-container>
</template>

<style scoped>
  .main-container {
    /* padding: 3% 5% 4% 5%; */
    margin-top: 2.5vh;
  }

  .type-select {
    width: 10% !important;
    margin-left: auto;
    margin-right: auto;
  }

  .spinner {
    height: 90%;
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .search-table {
    width: 100%;
    padding-bottom: 3vh;
    padding-left: 7vh;
    padding-right: 7vh;
    padding-top: 2vh;
  }

  .no-result-div {
    display: grid;
    font-size: 18pt;
    justify-content: center;
    margin-top: 17vh;
  }
</style>

<script>
  import http from "../http-common";
  import OrgTable from '../components/OrgTable';

  export default {
    components: { OrgTable },
    name: 'Search',
    props: ['searchParams'],
    data: () => ({
      originalSearchResults: [],
      search: {
        loaded: false,
        headers: [
          {
            "id": "name",
            "leftCorner": true,
            "name": "Nome",
            "align": "left"
          },
          {
            "id": "type",
            "rightCorner": true,
            "name": "Tipo",
            "align": "left"
          }
        ]
      },
      searchText: "",
      selectedType: "Todos",
      types: ["Todos","Área","Colaborador","Processo","Projeto","Ticket","Erro"]
    }),
    mounted: function() {
      this.searchText = this.$route.params.searchParams;
      this.reloadData();
    },
    watch: {
      '$route.params.searchParams': function () {
        this.search.loaded = false;
        this.searchText = this.$route.params.searchParams;
        this.reloadData();
      }
    },
    methods: {
      reloadData: function() {
        http.get(`/search/${this.searchText}`).then(response => {
          this.originalSearchResults = response.data;
          this.search.results = this.originalSearchResults;
          this.search.loaded = true;
        }).catch(err => {
          console.log(err);
        });
      },
      changeFilter: function() {
        if (this.selectedType === 'Todos') {
          this.search.results = this.originalSearchResults;
        } else {
          this.search.results = this.originalSearchResults.filter(res => res.type === this.selectedType);
        }
      }
    }
  }
</script>
