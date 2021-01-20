<template>
  <v-container v-if="employee.loaded" class="main-container" fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <div class="d-flex">
          <v-avatar class="employee-photo" color="var(--org-blue)" size="18vh">
            <img v-if="employee.photo" alt="Avatar" :src="'/assets/profile_pictures/' + employee.photo">
            <span v-else class="employee-icon">{{employee.icon}}</span>
          </v-avatar>
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <OrgTextField label="Nome" v-bind:value=employee.name />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Cargo" :value=employee.job_description></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Horário" :value=employee.schedule></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Email" :value=employee.email></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Contacto" :value=employee.phone_number></v-text-field>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="12" sm="2">
        <OrgTable class="area-table"
                  height="36vh"
                  :headers="employee.areas.headers"
                  :items="employee.areas.rows"
                  add-row="true"
                  path="/area"/>
      </v-col>
      <v-col cols="12" sm="4">
        <OrgTable class="process-table"
                  height="36vh"
                  :headers="employee.processes.headers"
                  :items="employee.processes.rows"
                  add-row="true"/>
      </v-col>

      <v-col cols="12" sm="6">
        <OrgTable class="ticket-table"
                  height="48vh"
                  :headers="employee.tickets.headers"
                  :items="employee.tickets.rows"
                  add-row="true"/>
      </v-col>
      <v-col cols="12" sm="6">
        <OrgTable class="project-table"
                  height="36vh"
                  :headers="employee.projects.headers"
                  :items="employee.projects.rows"
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
    margin-top: -12vh;
  }

  .project-table {
    width: 100%;
    padding: 3vh;
  }

  .process-table {
    width: 100%;
    padding: 3vh;
  }

  .area-table {
    width: 100%;
    padding: 3vh;
  }

  .spinner {
    height: 90%;
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .info-input {
    padding-left: 3vh;
    width: 90%;
  }

  .employee-photo {
    margin-left: 3vh;
    margin-top: 3vh;
  }

  .employee-icon {
    color: white;
    font-size: 35pt;
  }
</style>

<script>
  import http from "../http-common";
  import OrgTable from '../components/OrgTable';
  import OrgTextField from '../components/OrgTextField';

  export default {
    components: { OrgTable, OrgTextField },
    name: 'Employee',
    props: ['id'],
    data: () => ({
      employee: {loaded: false}
    }),
    mounted: function() {
      http.get("/employees").then(response => {
        this.employee = response.data.filter(e => e.id === Number(this.$route.params.id))[0];
        this.employee.loaded = true;
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
