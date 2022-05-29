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
        id='btn-login'
      >
        <span>Login</span>
      </v-btn>
      <div id='hi-user' class='d-none mx-2'></div>
      <v-btn
        id='btn-logout'
        class='d-none'
      >
        <span>Logout</span>
      </v-btn>

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
      <Calendario 
        id="calendario"
        class="d-none"
      />
      <Solicitudes
        id='tablaSolicitudes'
        class="d-none"
      />
    </v-main>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario';
import Solicitudes from './components/Solicitudes';

export default {
  name: 'App',

  components: {
    Calendario,
    Solicitudes
  },

  data: () => ({
    //
  }),
};
</script>
