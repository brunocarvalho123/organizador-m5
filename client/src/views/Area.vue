<template>
  <v-container class="main-container" fluid>
    <v-text-field class="area-name" label="Área" v-bind:value=area.name></v-text-field>
    <OrgTable class="ticket-table" :headers="area.tickets.headers" :items="area.tickets.rows" add-row="true"/>
    <OrgTable class="process-table" :headers="area.processes.headers" :items="area.processes.rows" add-row="true"/>
    <OrgTable class="employee-table" :headers="area.employees.headers" :items="area.employees.rows" add-row="true"/>
    <OrgTable class="project-table" :headers="area.projects.headers" :items="area.projects.rows" add-row="true"/>
  </v-container>
</template>

<style scoped>
  .main-container {
    padding: 3% 5% 4% 5%;
  }

  .area-name {
    /* transform-origin: top left;
    transform: scale(2.4); */
    width: 16%;
  }

  .v-label {
    font-size: 70px !important;
  }

  .ticket-table {
    width: 45%;
  }

  .employee-table {
    width: 15%;
  }

  .process-table {
    width: 25%;
  }
</style>

<script>
  import OrgTable from '../components/OrgTable';

  export default {
    components: { OrgTable },
    name: 'Area',
    data: () => ({
      area: {
        name: 'Área 1',
        tickets: {
          headers: [
            {leftCorner: true, name: 'Ticket'},
            {middle: true, name: 'URL'},
            {rightCorner: true, name: 'Prioridade'}
          ],
          rows: [
            {id: 1, name: 'ticket teste 1', url: 'www.ticket1.com', priority: 'Alta'},
            {id: 2, name: 'ticket teste 2', url: 'www.ticket2.com', priority: 'Media'},
            {id: 3, name: 'ticket teste 3', url: 'www.ticket3.com', priority: 'Baixa'},
            {id: 4, name: 'ticket teste 3', url: 'www.ticket3.com', priority: 'Baixa'}
          ]
        },
        processes: {
          headers: [
            {leftCorner: true, name: 'Processo'},
            {rightCorner: true, name: 'Nº erros na última hora'}
          ],
          rows: [
            {id: 1, name: 'Processo 1', nErrors: 5},
            {id: 2, name: 'Processo 2', nErrors: 5},
            {id: 3, name: 'Processo 3', nErrors: 5},
            {id: 4, name: 'Processo 4', nErrors: 5}
          ]
        },
        employees: {
          headers: [
            {single: true, name: 'Responsável'}
          ],
          rows: [
            {id: 1, name: 'João blahblah'},
            {id: 2, name: 'João blahblasd2'},
            {id: 3, name: 'João blahblah 3'}
          ]
        },
        projects: {
          headers: [
            {leftCorner: true, name: 'Projeto'},
            {middle: true, name: 'Progresso'},
            {rightCorner: true, name: 'Dias restantes'}
          ],
          rows: [
            {id: 1, name: 'Projeto da area 1', progress: 25, daysLeft: 93},
            {id: 2, name: 'Projeto da area 2', progress: 75, daysLeft: 35},
            {id: 3, name: 'Projeto da area 3', progress: 50, daysLeft: 103},
            {id: 4, name: 'Projeto da area 3', progress: 90, daysLeft: 12}
          ]
        }
      }
    }),
  }
</script>
