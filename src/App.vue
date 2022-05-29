<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <p>FIN!</p>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Menu derecha</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Calendario/>
    </v-main>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario';

export default {
  name: 'App',

  components: {
    Calendario
  },

  data: () => ({
    //
  }),
};
</script>
