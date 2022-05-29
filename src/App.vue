<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <img :src="image" width="90" />
      </div>

      <v-spacer></v-spacer>
      <v-btn
        id='btn-login'
      >
        <span>Login</span>
      </v-btn>
      <div id='hi-user' class='d-none mx-2 d-flex align-center'></div>
      <v-btn
        id='btn-logout'
        class='d-none'
      >
        <span>Logout</span>
      </v-btn>

    </v-app-bar>

    <v-main>
      <Calendario 
        id="calendario"
        class="d-none"
      />
    </v-main>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario';
import logo from './assets/logo_fin.png';

export default {
  name: 'App',

  components: {
    Calendario
  },

  data: () => ({
    //
    image: logo,
  }),
};
</script>
