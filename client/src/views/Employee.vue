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
              <OrgTextField label="Nome" v-model=employee.name @change="changeName"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Cargo" v-model=employee.job_description @change="modified = true"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Horário" v-model=employee.schedule @change="modified = true"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Email" v-model=employee.email @change="modified = true"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field class="info-input" color="var(--org-blue)" label="Contacto" v-model=employee.phone_number @change="modified = true"></v-text-field>
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
                  path="/area"
                  @clickAdd="openAreaDialog"
                  @deleteRow="deleteArea"/>
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
                  path="/project"
                  @clickAdd="openProjectDialog"
                  @deleteRow="deleteProject"/>
      </v-col>
    </v-row>

    <v-dialog v-model="areasDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar área
        </v-card-title>
        <v-card-text>
          <v-select v-model="dialogValue" color="var(--org-blue)" :items="availableAreas" label="Área" item-text="name" item-value="id"></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="areasDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createArea()">
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="projectsDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar projeto
        </v-card-title>
        <v-card-text>
          <v-text-field :name="Math.random()" color="var(--org-blue)" :label=dialogType v-model=dialogValue></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="projectsDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createProject()">
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template v-if="modified">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="2"
            fab
            absolute
            bottom
            right
            icon
            v-bind="attrs"
            v-on="on"
            color="white"
            class="save-button"
            @click="saveData()">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </template>
        <span>Guardar alterações</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn elevation="2" fab absolute bottom right icon
            v-bind="attrs"
            v-on="on"
            color="var(--org-blue)"
            class="undo-button"
            @click="reloadData()">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
        </template>
        <span>Reverter alterações</span>
      </v-tooltip>
    </template>

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

  .save-button {
    margin-bottom: 6vh;
    margin-right: 2vh;
    background-color: var(--org-blue);
  }

  .undo-button {
    margin-bottom: 6vh;
    margin-right: 10vh;
    background-color: white;
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
      employee: {loaded: false},
      employeeId: 0,
      modified: false,
      dialogValue: "",
      dialogType: "",
      availableAreas: [],
      availableProjects: [],
      newProjects: [],
      areasDialog: false,
      projectsDialog: false
    }),
    mounted: function() {
      this.employeeId = this.$route.params.id;
      this.reloadData();
    },
    methods: {
      reloadData:function() {
          http.get(`/employees/${this.employeeId}`).then(response => {
          this.employee = response.data;
          this.employee.loaded = true;
          this.modified = false
        }).catch(err => {
          console.log(err);
        });
      },
      changeName: function(data) {
        this.employee.name = data;
        this.modified = true;
      },
      openAreaDialog: function() {
        http.get("/areas").then(response => {
          this.availableAreas = response.data.map((e) => {return {id: e.id, name: e.name}});
          this.dialogType = 'Área';
          this.dialogValue = '';
          this.areasDialog = true;
        }).catch(err => {
          console.log(err);
        });
      },
      createArea: function() {
        this.employee.areas.rows.push({id: this.dialogValue, name: this.availableAreas.filter(e => e.id ==this.dialogValue)[0].name});
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.areasDialog = false;
        this.availableAreas = [];
      },
      deleteArea: function(data) {
        this.employee.areas.rows = this.employee.areas.rows.filter(area => area.id !== data.itemId);
        this.modified = true;
      },
      openProjectDialog: function() {
        this.dialogType = 'Projeto';
        this.dialogValue = '';
        this.projectsDialog = true;
      },
      createProject: function() {
        let newProject = {id: this.getSuitableId(this.employee.projects.rows), name: this.dialogValue};
        this.employee.projects.rows.push(newProject);
        this.newProjects.push(newProject);
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.projectsDialog = false;
      },
      deleteProject: function(data) {
        this.employee.projects.rows = this.employee.projects.rows.filter(project => project.id !== data.itemId);
        this.modified = true;
      },
      async saveData () {
        for (let idx = 0; idx < this.newProjects.length; idx++){
          let newProject = this.newProjects[idx];
          newProject.employee = this.employee.id;
          let response = await http.post('/projects', newProject);
          this.employee.projects.rows.filter(proj => proj.name === this.newProjects[idx].name)[0].id = response.data;
        }

        let payload = this.employee;
        delete payload.loaded;
        http.put(`/employees/${this.employeeId}`, payload)
        .then(response => {
          this.reloadData()
          console.log(response);
        })
        .catch(error => {
          this.reloadData()
          console.error("There was an error!", error);
        });
      }
    }
  }
</script>
