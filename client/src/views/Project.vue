<template>
  <v-container v-if="project.loaded" class="main-container" fluid>
    <v-row no-gutters>

      <v-col cols="12" sm="6">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <OrgTextField width="100%" label="Projeto" v-model=project.name @change="changeName"/>
          </v-col>

          <v-col class="info-container" cols="12" sm="6">
            <v-select class="info-input" v-model="project.area.id" color="var(--org-blue)" :items="availableAreas" label="Área" item-text="name" item-value="id" @change="changeArea"></v-select>
            <v-text-field class="info-input" color="var(--org-blue)" label="Data de início" v-model=project.start_date @change="modified = true"></v-text-field>
            <v-text-field class="info-input" color="var(--org-blue)" label="Conclusão prevista" v-model=project.end_date @change="modified = true"></v-text-field>
          </v-col>

          <v-col cols="12" sm="12">
            <v-textarea height="10vh" class="summary-input" color="var(--org-blue)" label="Resumo" v-model=project.summary @change="modified = true"></v-textarea>
          </v-col>
          <v-col cols="12" sm="6">
            <OrgTable class="employee-table"
                      height="36vh"
                      :headers="project.employees.headers"
                      :items="project.employees.rows"
                      add-row="true"
                      path="/employee"
                      @clickAdd="openEmployeesDialog"/>
          </v-col>
          <v-col cols="12" sm="6">
            <OrgTable class="notes-table"
                      height="36vh"
                      :headers="project.notes.headers"
                      :items="project.notes.rows"
                      add-row="true"
                      @clickAdd="openNotesDialog"/>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <OrgTable class="tasks-table"
                  height="78vh"
                  :headers="project.tasks.headers"
                  :items="project.tasks.rows"
                  add-row="true"
                  @clickAdd="openTasksDialog"
                  @checkTask="taskChecked"/>
      </v-col>
    </v-row>

    <v-dialog v-model="notesDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar nota
        </v-card-title>
        <v-card-text>
          <v-text-field :name="Math.random()" color="var(--org-blue)" :label=dialogType v-model=dialogValue></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="notesDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createNotes()">
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tasksDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar tarefa
        </v-card-title>
        <v-card-text>
          <v-text-field :name="Math.random()" color="var(--org-blue)" :label=dialogType v-model=dialogValue></v-text-field>
          <v-text-field :name="Math.random()" color="var(--org-blue)" :label=dialogType2 v-model=dialogValue2></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="tasksDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createTasks()">
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="employeesDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar responsável
        </v-card-title>
        <v-card-text>
          <v-select v-model="dialogValue" color="var(--org-blue)" :items="availableEmployees" label="Responsável" item-text="name" item-value="id"></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="employeesDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createEmployees()">
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
    name: 'Project',
    props: ['id'],
    data: () => ({
      paramsId: 0,
      project: {loaded: false},
      notesDialog: false,
      tasksDialog: false,
      employeesDialog: false,
      dialogType: "",
      dialogType2: "",
      dialogValue: "",
      dialogValue2: "",
      modified: false,
      availableEmployees: [],
      availableAreas: []
    }),
    mounted: function() {
      this.paramsId = Number(this.$route.params.id);
      http.get("/areas").then(response => {
        this.availableAreas = response.data.map((e) => {return {id: e.id, name: e.name}});
      }).catch(err => {
        console.log(err);
      });
      this.reloadData();
    },
    methods: {
      reloadData: function() {
        http.get("/projects").then(response => {
          this.project = response.data.filter(e => e.id === this.paramsId)[0];
          this.project.loaded = true;
          this.modified = false
        }).catch(err => {
          console.log(err);
        });
      },
      openNotesDialog: function() {
        this.dialogType = 'Nota';
        this.dialogValue = '';
        this.notesDialog = true;
      },
      openTasksDialog: function() {
        this.dialogType = 'Tarefa';
        this.dialogType2 = 'Dias restantes';
        this.dialogValue = '';
        this.dialogValue2 = '';
        this.tasksDialog = true;
      },
      openEmployeesDialog: function() {
        http.get("/employees").then(response => {
          this.availableEmployees = response.data.map((e) => {return {id: e.id, name: e.name}});
          this.dialogType = 'Responsável';
          this.dialogValue = '';
          this.employeesDialog = true;
        }).catch(err => {
          console.log(err);
        });
      },
      createNotes: function() {
        this.project.notes.rows.push({id: this.project.notes.rows.length+1, notes: this.dialogValue});
        this.modified = true;
        this.dialogValue= '';
        this.dialogType = '';
        this.notesDialog = false;
      },
      createTasks: function() {
        this.project.tasks.rows.push({id: this.project.tasks.length+1, done: false, name: this.dialogValue, daysLeft: this.dialogValue2});
        this.modified = true;
        this.dialogValue = '';
        this.dialogValue2 = '';
        this.dialogType = '';
        this.tasksDialog = false;
      },
      createEmployees: function() {
        this.project.employees.rows.push({id: this.dialogValue, name: this.availableEmployees.filter(e => e.id ==this.dialogValue)[0].name});
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.employeesDialog = false;
        this.availableEmployees = [];
      },
      changeName: function(data) {
        this.project.name = data;
        this.modified = true;
      },
      changeArea: function(data) {
        this.project.area.name = this.availableAreas.filter(e => e.id == data)[0].name;
        this.modified = true;
      },
      taskChecked: function() {
        this.modified = true;
      },
      saveData: function() {
        // debugger; // eslint-disable-line no-debugger
        console.log('todo');
      }
    }
  }
</script>
