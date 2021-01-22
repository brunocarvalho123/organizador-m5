<template>
  <v-container v-if="process.loaded" class="main-container" fluid>
    <v-row no-gutters>

      <v-col cols="12" sm="6">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <OrgTextField width="100%" label="Processo" v-model=process.name @change="changeName"/>
          </v-col>

          <v-col class="info-container" cols="12" sm="6">
            <v-select class="info-input" v-model="process.area.id" color="var(--org-blue)" :items="availableAreas" label="Área" item-text="name" item-value="id" @change="changeArea"></v-select>
          </v-col>

          <v-col cols="12" sm="12">
            <v-textarea height="10vh" class="summary-input" color="var(--org-blue)" label="Resumo" v-model=process.summary @change="modified = true"></v-textarea>
          </v-col>
          <v-col cols="12" sm="6">
            <OrgTable class="employee-table"
                      height="36vh"
                      :headers="process.employees.headers"
                      :items="process.employees.rows"
                      add-row="true"
                      path="/employee"
                      @clickAdd="openEmployeesDialog"
                      @deleteRow="deleteEmployee"/>
          </v-col>
          <v-col cols="12" sm="6">
            <OrgTable class="notes-table"
                      height="36vh"
                      :headers="process.notes.headers"
                      :items="process.notes.rows"
                      add-row="true"
                      @clickAdd="openNotesDialog"
                      @deleteRow="deleteNote"/>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <OrgTable class="errors-table"
                  height="78vh"
                  :headers="process.errors.headers"
                  :items="process.errors.rows"
                  @deleteRow="deleteError"/>
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

    <v-dialog v-model="errorsDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Error TODO
        </v-card-title>
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

  .errors-table {
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
    name: 'Process',
    props: ['id'],
    data: () => ({
      paramsId: 0,
      process: {loaded: false},
      notesDialog: false,
      errorsDialog: false,
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
        http.get(`/processes/${this.paramsId}`).then(response => {
          this.process = response.data;
          if (this.process.area === undefined) {
            this.process.area = {id: undefined};
          }
          this.process.loaded = true;
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
        this.process.notes.rows.push({id: this.getSuitableId(this.process.notes.rows), notes: this.dialogValue});
        this.modified = true;
        this.dialogValue= '';
        this.dialogType = '';
        this.notesDialog = false;
      },
      createEmployees: function() {
        this.process.employees.rows.push({id: this.dialogValue, name: this.availableEmployees.filter(e => e.id ==this.dialogValue)[0].name});
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.employeesDialog = false;
        this.availableEmployees = [];
      },
      changeName: function(data) {
        this.process.name = data;
        this.modified = true;
      },
      changeArea: function(data) {
        this.process.area.name = this.availableAreas.filter(e => e.id == data)[0].name;
        this.modified = true;
      },
      deleteEmployee: function(data) {
        this.process.employees.rows = this.process.employees.rows.filter(emp => emp.id !== data.itemId);
        this.modified = true;
      },
      deleteNote: function(data) {
        this.process.notes.rows = this.process.notes.rows.filter(note => note.id !== data.itemId);
        this.modified = true;
      },
      deleteError: function(data) {
        this.process.errors.rows = this.process.errors.rows.filter(error => error.id !== data.itemId);
        this.modified = true;
      },
      saveData: function() {
        let payload = this.process;
        delete payload.loaded;
        http.put(`/processes/${this.paramsId}`, payload)
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
