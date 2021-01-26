<template>
  <v-container v-if="dashboard.loaded" class="main-container d-flex" fluid>

    <div class="employees-container">
      <div class="employee-header">
        Colaboradores
      </div>

      <div v-for="(employee, idx) in employees" v-bind:key="idx" class="employee-row" @click="goToEmployee(employee.id)">
        <p>{{employee.name}}</p>
        <v-avatar class="employee-photo" color="var(--org-blue)" size="5vh">
          <img v-if="employee.photo" alt="Avatar" :src="'/assets/profile_pictures/' + employee.photo"/>
          <span v-else class="employee-icon">{{employee.icon}}</span>
        </v-avatar>
      </div>

      <div class="add-row" @click="createEmployee">
        <v-icon class="plus-icon" color="var(--org-blue)" size="3.5vh">
          mdi-plus-circle
        </v-icon>
      </div>
    </div>


    <div class="areas-container">
      <div v-for="(area, idx) in areas" v-bind:key="idx" class="area-box" @click="goToArea(area.id)">
        <div class="area-header">
          {{area.name}}
          <v-icon color="white" size="3.5vh">
            mdi-close-circle
          </v-icon>
        </div>
        <div class="area-content">
          <div class="area-item">
            <v-icon color="var(--org-blue)" size="4vh">
              mdi-bug
            </v-icon>
            {{area.tickets.rows.length}}
          </div>
          <div class="area-item">
            <v-icon color="var(--org-blue)" size="4vh">
              mdi-account
            </v-icon>
            {{area.employees.rows.length}}
          </div>
          <div class="area-item">
            <v-icon color="var(--org-blue)" size="4vh">
              mdi-xml
            </v-icon>
            {{area.processes.rows.length}}
          </div>
          <div class="area-item">
            <v-icon color="var(--org-blue)" size="4vh">
              mdi-format-list-checkbox
            </v-icon>
            {{area.projects.rows.length}}
          </div>
        </div>
      </div>

      <div class="new-area" @click="createArea">
        <v-icon color="var(--org-blue)" size="15vh">
          mdi-plus-circle
        </v-icon>
      </div>
    </div>

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
    margin-top: 4vh;
  }

  .spinner {
    height: 90%;
    display:flex;
    justify-content: center;
    align-items: center;
  }

  .employees-container {
    background-color: white;
    height: 82vh;
    width: 45vh;
    margin-right: 2vh;
    margin-left: 3vh;
    border-radius: 10px;
    box-shadow: 0px 0px 15px 4px rgba(0, 0, 0, 0.288);
  }

  .employee-header {
    background-color: var(--org-blue);
    border-radius: 10px 10px 0px 0px;
    height: 8%;
    color: white;
    font-size: 3vh;
    font-weight: bold;
    padding: 3% 0% 0% 4%;
  }

  .employee-row {
    display: flex;
    justify-content:space-between;
    border-bottom: 1px solid var(--org-nice-grey);
    cursor: pointer;
    color: var(--org-dark-grey);
    font-weight: 450;
    height: 8%;
    font-size: 2vh;
    padding: 4% 0% 0% 4%;
  }

  .add-row {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--org-nice-grey);
    cursor: pointer;
    height: 8%;
  }

  .employee-icon {
    color: white;
    font-size: 35pt;
  }

  .employee-photo {
    margin-top: -1vh;
    margin-right: 1vh;
  }

  .areas-container {
    display: grid;
    grid-template-columns: 32vh 32vh 32vh 32vh;
    grid-template-rows: 29vh 29vh 29vh;
    height: 87vh;
    width: 75%;
    margin-right: 0vh;
  }

  .area-box {
    cursor: pointer;
    margin: 0% 7% 15% 7%;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 1px rgba(56, 56, 56, 0.274);
  }

  .area-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--org-blue);
    border-radius: 10px 10px 0px 0px;
    height: 25%;
    color: white;
    font-size: 3vh;
    font-weight: bold;
    padding: 3% 5% 3% 5%;
  }

  .new-area {
    display: flex;
    margin: 0% 7% 15% 7%;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .area-content {
    display: grid;
    grid-template-columns: auto auto;
    font-size: 3vh;
    font-weight: 450;
    color: var(--org-dark-grey);
  }

  .area-item {
    display: flex;
    justify-content: space-evenly;
    margin: 2vh 3vh 1.5vh 1vh;
  }
</style>

<script>
  import http from "../http-common";

  export default {
    name: 'Home',

    data: () => ({
      dashboard: {loaded: false},
      employees: [],
      areas: []
    }),
    mounted: function() {
      this.reloadData();
    },
    methods: {
      reloadData: function() {
        http.get(`/areas`).then(response => {
          this.areas = response.data;
          http.get(`/employees`).then(response2 => {
            this.employees = response2.data;
            this.dashboard.loaded = true;
            }).catch(err => {
              console.log(err);
            });
        }).catch(err => {
          console.log(err);
        });
      },
      createEmployee: function() {

      },
      createArea: function() {

      },
      goToEmployee: function(id) {
        this.$router.push(`employee/${id}`);
      },
      goToArea: function(id) {
        this.$router.push(`area/${id}`);
      }
    }
  }
</script>
