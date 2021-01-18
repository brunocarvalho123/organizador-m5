<template>
  <v-container v-if="project.loaded" class="main-container" fluid>
    <v-row no-gutters>

      <v-col cols="12" sm="6">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <OrgTextField width="100%" label="Projeto" v-bind:value=project.name />
          </v-col>

          <v-col class="info-container" cols="12" sm="6">
            <v-text-field class="info-input" color="var(--org-blue)" label="Área" :value=project.area.name></v-text-field>
            <v-text-field class="info-input" color="var(--org-blue)" label="Data de início" :value=project.start_date></v-text-field>
            <v-text-field class="info-input" color="var(--org-blue)" label="Conclusão prevista" :value=project.end_date></v-text-field>
          </v-col>

          <v-col cols="12" sm="12">
            <v-textarea height="10vh" class="summary-input" color="var(--org-blue)" label="Resumo" :value=project.summary></v-textarea>
          </v-col>
          <v-col cols="12" sm="6">
            <OrgTable class="employee-table"
                      height="36vh"
                      :headers="project.employees.headers"
                      :items="project.employees.rows"
                      add-row="true"/>
          </v-col>
          <v-col cols="12" sm="6">
            <OrgTable class="notes-table"
                      height="36vh"
                      :headers="project.notes.headers"
                      :items="project.notes.rows"
                      add-row="true"/>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <OrgTable class="tasks-table"
                  height="64.5vh"
                  :headers="project.tasks.headers"
                  :items="project.tasks.rows"
                  add-row="true"/>
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

  .info-container {
    padding: 3vh;
  }

  .summary-input {
    width: 100%;
    padding-left: 3vh;
    padding-right: 3vh;
  }

  .employee-table {
    width: 100%;
    padding: 3vh;
  }

  .notes-table {
    width: 100%;
    padding: 3vh;
  }

  .tasks-table {
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
  import axios from "axios";
  import OrgTable from '../components/OrgTable';
  import OrgTextField from '../components/OrgTextField';

  export default {
    components: { OrgTable, OrgTextField },
    name: 'Project',
    props: ['id'],
    data: () => ({
      project: {loaded: false}
    }),
    mounted: function() {
      axios.get('/data/projects.json').then(response => {
        this.project = response.data[this.$route.params.id];
        this.project.loaded = true;
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
