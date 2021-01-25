<template>
  <v-container v-if="area.loaded" class="main-container" fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <OrgTextField label="Area" v-model=area.name @change="changeName"/>
      </v-col>
      <v-col cols="12" sm="2">
        <OrgTable class="employee-table"
                  height="36vh"
                  :headers="area.employees.headers"
                  :items="area.employees.rows"
                  add-row="true"
                  path="/employee"
                  @clickAdd="openEmployeesDialog"
                  @deleteRow="deleteEmployee"/>
      </v-col>
      <v-col cols="12" sm="4">
        <OrgTable class="process-table"
                  height="36vh"
                  :headers="area.processes.headers"
                  :items="area.processes.rows"
                  add-row="true"
                  path="/process"
                  @clickAdd="openProcessDialog"
                  @deleteRow="deleteProcess"/>
      </v-col>

      <v-col cols="12" sm="6" offset=0>
        <OrgTable class="ticket-table"
                  height="64.5vh"
                  :headers="area.tickets.headers"
                  :items="area.tickets.rows"
                  add-row="true"
                  path="/ticket"
                  @clickAdd="openTicketDialog"
                  @deleteRow="deleteTicket"/>
      </v-col>
      <v-col cols="12" sm="6">
        <OrgTable class="project-table"
                  height="36vh"
                  :headers="area.projects.headers"
                  :items="area.projects.rows"
                  add-row="true"
                  path="/project"
                  @clickAdd="openProjectDialog"
                  @deleteRow="deleteProject"/>
      </v-col>
    </v-row>

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

    <v-dialog v-model="ticketsDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar ticket
        </v-card-title>
        <v-card-text>
          <v-text-field :name="Math.random()" color="var(--org-blue)" :label=dialogType v-model=dialogValue></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="ticketsDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createTicket()">
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="processesDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Adicionar processo
        </v-card-title>
        <v-card-text>
          <v-text-field :name="Math.random()" color="var(--org-blue)" :label=dialogType v-model=dialogValue></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--org-grey)" text @click="processesDialog=false">
            Cancelar
          </v-btn>
          <v-btn color="var(--org-blue)" text @click="createProcess()">
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
    name: 'Area',
    props: ['id'],
    data: () => ({
      area: {loaded: false},
      areaId: 0,
      dialogType: "",
      dialogType2: "",
      dialogValue: "",
      dialogValue2: "",
      modified: false,
      availableEmployees: [],
      newProjects: [],
      newProcesses: [],
      newTickets: [],
      employeesDialog: false,
      projectsDialog: false,
      processesDialog: false,
      ticketsDialog: false
    }),
    mounted: function() {
      this.areaId = this.$route.params.id;
      this.reloadData();
    },
    methods: {
      reloadData:function() {
          http.get(`/areas/${this.areaId}`).then(response => {
          this.area = response.data;
          this.area.loaded = true;
          this.modified = false
        }).catch(err => {
          console.log(err);
        });
      },
      changeName: function(data) {
        this.area.name = data;
        this.modified = true;
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
      createEmployees: function() {
        this.area.employees.rows.push({id: this.dialogValue, name: this.availableEmployees.filter(e => e.id ==this.dialogValue)[0].name});
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.employeesDialog = false;
        this.availableEmployees = [];
      },
      deleteEmployee: function(data) {
        this.area.employees.rows = this.area.employees.rows.filter(emp => emp.id !== data.itemId);
        this.modified = true;
      },
      openProjectDialog: function() {
        this.dialogType = 'Projeto';
        this.dialogValue = '';
        this.projectsDialog = true;
      },
      createProject: function() {
        let newProject = {id: this.getSuitableId(this.area.projects.rows), name: this.dialogValue};
        this.area.projects.rows.push(newProject);
        this.newProjects.push(newProject);
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.projectsDialog = false;
      },
      deleteProject: function(data) {
        this.area.projects.rows = this.area.projects.rows.filter(project => project.id !== data.itemId);
        this.modified = true;
      },
      openProcessDialog: function() {
        this.dialogType = 'Processo';
        this.dialogValue = '';
        this.processesDialog = true;
      },
      createProcess: function() {
        let newProcess = {id: this.getSuitableId(this.area.processes.rows), name: this.dialogValue};
        this.area.processes.rows.push(newProcess);
        this.newProcesses.push(newProcess);
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.processesDialog = false;
      },
      deleteProcess: function(data) {
        this.area.processes.rows = this.area.processes.rows.filter(Process => Process.id !== data.itemId);
        this.modified = true;
      },
      openTicketDialog: function() {
        this.dialogType = 'Ticket';
        this.dialogValue = '';
        this.ticketsDialog = true;
      },
      createTicket: function() {
        let newticket = {id: this.getSuitableId(this.area.tickets.rows), name: this.dialogValue};
        this.area.tickets.rows.push(newticket);
        this.newTickets.push(newticket);
        this.modified = true;
        this.dialogValue = '';
        this.dialogType = '';
        this.ticketsDialog = false;
      },
      deleteTicket: function(data) {
        this.area.tickets.rows = this.area.tickets.rows.filter(ticket => ticket.id !== data.itemId);
        this.modified = true;
      },
      async saveData () {
        for (let idx = 0; idx < this.newProjects.length; idx++){
          let newProject = this.newProjects[idx];
          newProject.area = this.area.id;
          let response = await http.post('/projects', newProject);
          this.area.projects.rows.filter(proj => proj.name === this.newProjects[idx].name)[0].id = response.data;
        }

        for (let idx = 0; idx < this.newProcesses.length; idx++){
          let newProcess = this.newProcesses[idx];
          newProcess.area = this.area.id;
          let response = await http.post('/processes', newProcess);
          this.area.processes.rows.filter(proc => proc.name === this.newProcesses[idx].name)[0].id = response.data;
        }

        for (let idx = 0; idx < this.newTickets.length; idx++){
          let newTicket = this.newTickets[idx];
          newTicket.area = this.area.id;
          let response = await http.post('/tickets', newTicket);
          this.area.tickets.rows.filter(tick => tick.name === this.newTickets[idx].name)[0].id = response.data;
        }

        let payload = this.area;
        delete payload.loaded;
        http.put(`/areas/${this.areaId}`, payload)
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
