import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import es from "vuetify/es5/locale/es";

Vue.use(Vuetify);

Vue.component("my-component", {
  methods: {
    changeLocale() {
      this.$vuetify.lang.current = "es";
    },
  },
});

export default new Vuetify({
  lang: {
    locales: { es },
    current: "es",
  },
});
