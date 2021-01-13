<template>
  <v-container class="main-container" fluid>
    <v-text-field class="area-name" label="Área" v-bind:value=area.name></v-text-field>

    <v-simple-table fixed-header height="300px">
      <template v-slot:default>
        <thead>
          <tr class="table-header">
            <th class="text-left">Ticket</th>
            <th class="text-left">URL</th>
            <th class="text-left">Prioridade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in area.tickets" :key="ticket.id">
            <td>{{ ticket.name }}</td>
            <td>{{ ticket.url }}</td>
            <td>{{ ticket.priority }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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

  tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);
  }

  .v-label{
    font-size: 70px !important;
  }

  .table-header {
    background-color: var(--org-blue) !important;
  }
</style>

<script>
  export default {
    name: 'Area',

    data: () => ({
      area: {
        name: 'Área 1',
        tickets: [
          {id: 1, name: 'ticket teste 1', url: 'www.ticket1.com', priority: 'Alta'},
          {id: 2, name: 'ticket teste 2', url: 'www.ticket2.com', priority: 'Media'},
          {id: 3, name: 'ticket teste 3', url: 'www.ticket3.com', priority: 'Baixa'}
        ],
        processes: [],
        employees: [],
        project: []
      }
    }),
  }
</script>
