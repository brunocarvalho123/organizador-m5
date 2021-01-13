<template>
  <v-simple-table fixed-header height="300px">
    <template v-slot:default>
      <thead>
        <tr>
          <template v-for="header in headers">
            <th v-if="header.leftCorner" :key="header.name" class='table-header header-left'>
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
            <th v-if="header.rightCorner" :key="header.name" class='table-header header-right'>
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
            <th v-if="header.single" :key="header.name" class='table-header header-single'>
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
            <th v-if="header.middle" :key="header.name" class='table-header'>
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
          <tr v-for="item in items" v-bind:key="item.id">
            <template v-for="prop in Object.keys(item)">
              <td  v-bind:key="prop+item.id" v-if="prop!='id'" class="table-row">{{ item[prop] }}</td>
            </template>
          </tr>
          <tr v-if="addRow">
            <td class="add-row" :colspan="headers.length">
              <v-icon color="var(--org-blue)">
                mdi-plus-circle
              </v-icon>
            </td>
          </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<style scoped>
  .table-header {
    background-color: var(--org-blue) !important;
    color: white !important;
    font-size: 11pt !important;
  }

  .header-left {
    border-top-left-radius: 10px;
  }

  .header-right {
    border-top-right-radius: 10px;
  }

  .header-single {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .table-row {
    font-size: 10pt !important;
  }

  .add-row {
    text-align: center;
    border-bottom: 1px solid var(--org-nice-grey);
  }

  tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);
  }

  .sort-icon {
    font-size: 11pt;
    color: var(--org-light-blue)
  }
</style>

<script>
  export default {
    name: 'OrgTable',
    props: ['headers','items', 'addRow'],
    data: () => ({
    }),
  }
</script>
