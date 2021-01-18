<template>
  <v-text-field id="textField" :style="cssVars" :height=60 color="var(--org-blue)" class="area-name" v-bind:value="value" @change="modified">
    <template v-slot:label>
      <span class='area-label'>
        {{label}}
      </span>
    </template>
  </v-text-field>
</template>

<style>
  .area-name {
    width: var(--field-width);
    padding: 3vh;
    font-size: 28pt;
    color: var(--org-blue);
  }

  .area-label {
    font-size: 18pt;
    padding-bottom: 10px;
  }

  #textField {
    margin-top: 7px;
  }

</style>

<script>
  export default {
    name: 'OrgTextField',
    props: ['value','label','width'],
    methods: {
      modified(value) {
        // debugger; // eslint-disable-line no-debugger
        this.$emit('change', value);
      }
    },
    computed: {
      cssVars () {
        return{
          /* variables you want to pass to css */
          '--field-width': (this.width || '50%')
        }
      },
    },
    data: () => ({
    }),
  }
</script>
