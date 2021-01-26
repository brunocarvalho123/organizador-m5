<template>
  <v-simple-table fixed-header :height=height>
    <template v-slot:default>
      <thead>
        <tr>
          <template v-for="header in headers">
            <th v-if="header.leftCorner" :key="header.name" class='table-header header-left' :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]">
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
            <th v-if="header.rightCorner" :key="header.name" class='table-header header-right' :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]">
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
            <th v-if="header.single" :key="header.name" class='table-header header-single' :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]">
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
            <th v-if="header.middle" :key="header.name" class='table-header' :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]">
              {{header.name}}
              <!-- <v-icon class="sort-icon">mdi-arrow-up-down-bold</v-icon> -->
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
          <tr v-for="item in items" v-bind:key="item.id" @click="clickRow(item)" :class="((path || searchPath) ? 'row-pointer table-rows' : 'table-rows')">
            <template v-for="header in headers">
              <td v-if="header.type === 'progress-bar'" v-bind:key="header.id+item.id" :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]" class="table-row">
                <v-progress-linear height=5 color="var(--org-grey)" :value=item[header.id]></v-progress-linear>
              </td>
              <td v-else-if="header.type === 'checkbox'" v-bind:key="header.id+item.id" :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]" class="table-row table-checkbox">
                <v-checkbox v-on:change="checkTask" v-model="item[header.id]" height=5 color="var(--org-blue)"></v-checkbox>
              </td>
              <td v-else v-bind:key="header.id+item.id" :style="[header.align != undefined ? {'text-align': header.align} : {'text-align': 'left'}]" class="table-row">
                {{ item[header.id] }}
              </td>
            </template>
            <span v-if="!hideDelete" class="hidden-table-column" @click="deleteRow($event, item.id)">
              <v-icon color="var(--org-blue)">
                mdi-close-circle
              </v-icon>
            </span>
          </tr>
          <tr v-if="addRow">
            <td class="add-row" :colspan="headers.length" @click="clickAdd">
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

  .table-checkbox {
    width: 1%;
  }

  .table-row-center {
    font-size: 10pt !important;
    text-align: center;
  }

  .add-row {
    text-align: center;
    border-bottom: 1px solid var(--org-nice-grey);
    cursor: pointer;
  }

  .row-pointer {
    cursor: pointer;
  }

  tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);
  }

  tbody {
    box-shadow: 0px 0px 5px 1px rgba(56, 56, 56, 0.274);
  }

  .sort-icon {
    font-size: 11pt;
    color: var(--org-light-blue)
  }

  .table-rows:hover .hidden-table-column {
    display: block;
  }

  .hidden-table-column {
    cursor: pointer;
    margin-top: 1.2vh;
    margin-left: -4vh;
    position: sticky;
    display: none;
  }
</style>

<script>
  export default {
    name: 'OrgTable',
    props: ['headers','items', 'addRow', 'height', "path", "hideDelete", "searchPath"],
    methods: {
      clickAdd() {
        this.$emit('clickAdd');
      },
      clickRow(item) {
        if (this.path && item.id !== undefined) {
          this.$router.push(`${this.path}/${item.id}`);
          return;
        }
        if (this.searchPath && item.real_id !== undefined && item.url !== undefined) {
          this.$router.push(`${item.url}/${item.real_id}`);
          return;
        }
      },
      checkTask(value) {
        this.$emit('checkTask', value);
      },
      deleteRow(event, itemId) {
        event.stopPropagation();
        this.$emit('deleteRow', {event: event, itemId: itemId});
      }
    },
    data: () => ({
    }),
  }
</script>
