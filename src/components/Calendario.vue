<template>
  <div>
    <v-row >
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" @click="setToday">
              Hoy
            </v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Días</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mes</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 días</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            :short-weekdays="false"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            :weekdays="weekday"
            :interval-minutes= 45
            :first-interval="9"
            :interval-count= 28
          ></v-calendar>
          <!-- Agregar Modal Agregar Evento -->
          
          <!-- Funciones  vue -->
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="true"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <!-- Agregar Funcionalidades Editar y Eliminar -->
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <!-- <v-btn icon v-if="currentUserid === selectedEvent.user_id" @click="edit_event = true">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->
    
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancelar
                </v-btn>
                <v-btn color="primary" dark class="mr-4" v-if="currentUserid === selectedEvent.user_id" @click = "cargarMiHorario(selectedEvent)">
                Ofrecer Horario
                </v-btn>
                <v-btn color="primary" dark class="mr-4" v-if="currentUserid !== selectedEvent.user_id" @click = "cargarHorarioSolicitado(selectedEvent)">
                Solicitar Horario
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>

        <v-container fluid>
            <v-card elevation=1>
              <v-row no-gutters>
                <v-col>
                  <v-card elevation=0>
                    <v-container>
                        <h3>Horario que ofrezco</h3>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Nombre
                                </th>
                                <th class="text-left">
                                  Inicio
                                </th>
                              </tr>
                            </thead>
                            <tbody v-if="user_available_event != null">
                              <tr>
                                <td>{{ user_available_event.name }}</td>
                                <td>{{ user_available_event.start | formatDate  }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                    </v-container>
                  </v-card>
                  </v-col>
                  <v-col>
                  <v-card elevation=0>
                    <v-container>
                        <h3 v-if="user_available_event === null">&nbsp;</h3>
                        <h3 v-else-if="colleague_available_event.length < 1">&nbsp;</h3>
                        <v-btn block v-else-if="user_available_event !== null && colleague_available_event.length > 0" dark class="mr-4" @click.prevent="enviarSolicitud()">
                      Enviar solicitud
                      </v-btn>
                    </v-container>
                  </v-card>
                  </v-col>
                  <v-col>
                  <v-card elevation=0>
                    <v-container>
                        <h3>Horario que solicito</h3>
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Nombre
                                </th>
                                <th class="text-left">
                                  Inicio
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="event in colleague_available_event"
                                :key="event.id"
                              >
                                <td>{{ event.name }}</td>
                                <td>{{ event.start | formatDate }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
          
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          
          <Solicitudes
            id='tablaSolicitudes'
            class="d-none mt-5"
          />
          </v-container>


      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { db, currentUser } from '../main';
  import moment from 'moment';
  import Solicitudes from './Solicitudes';


  export default {
    components: {
      Solicitudes
    },
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        '4day': '4 Días',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      // Adicionales...
      name: null,
      details: null,
      color: '#1976D2',
      edit_event: false,
      currentlyEditing: null,
      active_id: null,
      currentUserid: null,
      user_available_event: null,
      colleague_available_event: [],
      weekday: [1 ,2, 3, 4, 5],
    }),
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    created () {
      this.getEvents();
    },
    mounted () {
      this.$refs.calendar.checkChange();

      
    },
    methods: {
      cargarMiHorario(ev){
        this.user_available_event = ev;
        //colleague_available_event
      },
      cargarHorarioSolicitado(ev){
        this.colleague_available_event.push(ev);
      },

      async enviarSolicitud(){
        console.log(this.colleague_available_event);
        try {    
            this.colleague_available_event.forEach(async (cEv) => {
                  await db.collection('solicitudes-de-cambio').add({
                  doc_id_ofrece: this.user_available_event.id,
                  start_ofrece: this.user_available_event.start,
                  id_ofrece: this.user_available_event.user_id,
                  name_ofrece: this.user_available_event.user,
                  color_ofrece: this.user_available_event.color,

                  doc_id_acepta: cEv.id,
                  start_acepta: cEv.start,
                  estado: "pendiente",
                  id_acepta: cEv.user_id,
                  name_acepta: cEv.user,
                  color_acepta: cEv.color
              })
            })
            this.editEvent(this.user_available_event);
            this.colleague_available_event = [];
            this.user_available_event = null;
            this.getEvents()
        } catch (error) {
              console.log(error);
        }
      },

      async editEvent(ev){
        try {
          console.log(ev.id)
          await db.collection('eventos').doc(ev.id).update({
            available: true
          })
          
        } catch (error) {
          console.log(error)
        }
      },

      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? ''
          : ['', '', '', '', '', '', '', '', '', ''][d % 10]
      },
      async getEvents() {
        try {
          const snapshot = await db.collection("eventos").get();
          const events = [];
          snapshot.forEach(doc => {
            let appData = doc.data();
            appData.id = doc.id;
            const end = new Date(appData.end.seconds * 1000);
            const start = new Date(appData.start.seconds * 1000);
            const titulo = appData.available ? `${appData.user_name} 🟢` : `${appData.user_name}`;
            const color = appData.color;
            const details = `${moment(start).format('DD-MM-YYYY HH:mm')} - ${moment(end).format('HH:mm')}`;
            
            events.push({
              color: color,
              id: appData.id,
              start: moment(start).format('YYYY-MM-DD HH:mm'),
              end: moment(end).format('YYYY-MM-DD HH:mm'),
              details: details,
              user: appData.user_name,
              user_id: appData.user_id,
              run: appData.run,
              name: titulo,
              block: appData.block_id
            })
          });
          this.events = events;
          this.currentUserid = currentUser.uid;
        } catch (error) {
          console.error(error);
        }
      },
    },

    filters: {
      formatDate (date) {
        return moment(date).format('DD-MM-YYYY HH:mm')
      },
    },
  }
</script>