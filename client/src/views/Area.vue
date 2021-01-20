<template>
  <v-container v-if="area.loaded" class="main-container" fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <OrgTextField label="Area" v-bind:value=area.name />
      </v-col>
      <v-col cols="12" sm="2">
        <OrgTable class="employee-table"
                  height="36vh"
                  :headers="area.employees.headers"
                  :items="area.employees.rows"
                  add-row="true"
                  path="/employee"/>
      </v-col>
      <v-col cols="12" sm="4">
        <OrgTable class="process-table"
                  height="36vh"
                  :headers="area.processes.headers"
                  :items="area.processes.rows"
                  add-row="true"/>
      </v-col>

      <v-col cols="12" sm="6" offset=0>
        <OrgTable class="ticket-table"
                  height="64.5vh"
                  :headers="area.tickets.headers"
                  :items="area.tickets.rows"
                  add-row="true"/>
      </v-col>
      <v-col cols="12" sm="6">
        <OrgTable class="project-table"
                  height="36vh"
                  :headers="area.projects.headers"
                  :items="area.projects.rows"
                  add-row="true"
                  path="/project"/>
      </v-col>
    </v-row>

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

  .ticket-table {
    width: 100%;
    padding: 3vh;
    margin-top: -29vh;
  }

  .project-table {
    width: 100%;
    padding: 3vh;
  }

  .employee-table {
    width: 100%;
    padding: 3vh;
  }

  .process-table {
    width: 100%;
    padding: 3vh;
  }

  .spinner {
    height: 90%;
    display:flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script>
  import http from "../http-common";
  import OrgTable from '../components/OrgTable';
  import OrgTextField from '../components/OrgTextField';

  export default {
    components: { OrgTable, OrgTextField },
    name: 'Area',
    props: ['id'],
    data: () => ({
      area: {loaded: false}
    }),
    mounted: function() {
      http.get("/areas").then(response => {
        this.area = response.data[this.$route.params.id];
        this.area.loaded = true;
      }).catch(err => {
        console.log(err);
      });
    },
    methods: {
      test: function(a) {
        console.log(a);
      }
    }
  }
</script>
