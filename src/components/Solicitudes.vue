<template>
<v-card elevation=1>
    <v-container fluid>
        <h3> Solicitudes recibidas </h3>

<v-simple-table>
    <template v-slot:default>
    <thead>
        <tr>
            <th class="text-left">
                Bloque solicitado
            </th>
            <th class="text-left">
                Bloque ofrecido
            </th>
            <th>

            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="solicitud in bloques" :key="solicitud.id">
        <td>{{ solicitud.bloqueSolicitado | formatDate }}</td>
        <td>{{ solicitud.bloqueOfrecido | formatDate }}</td>
        <td>
            <v-btn
                class="ma-2"
                color="#004D40"
                dark
                @click.prevent='aceptarCambio(solicitud)'
            >
                Aceptar
                <v-icon
                dark
                right
                >
                mdi-checkbox-marked-circle
                </v-icon>
            </v-btn>

            <v-btn
                class="ma-2"
                color="#B71C1C"
                dark
                @click.prevent='rechazarCambio(solicitud.id)'
            >
                Rechazar
                <v-icon
                dark
                right
                >
                mdi-cancel
                </v-icon>
            </v-btn>
        </td>
        </tr>
    </tbody>
    </template>
</v-simple-table>

</v-container>
</v-card>
</template>

<script>
    import moment from 'moment';
    import { db, currentUser } from '../main';
    export default {
        data () {
            return {
                bloques: [],
            }
        },

        mounted() {
            this.getSolicitudes();
        },

        methods: {
            
            async getSolicitudes() {
                try {
                    const snapshot = await db.collection('solicitudes-de-cambio').get();
                    const mis_solicitudes = [];
                    snapshot.forEach(async (doc) => {
                        let appData = doc.data();
                        appData.id = doc.id;
                        if (appData.estado === 'pendiente' && appData.id_acepta === currentUser.uid){
                        mis_solicitudes.push({
                            id: appData.id,
                            bloqueSolicitado: appData.start_acepta,
                            bloqueOfrecido: appData.start_ofrece,
                            docIdAcepta: appData.doc_id_acepta,
                            docIdOfrece: appData.doc_id_ofrece,
                            userIdAcepta:  appData.id_acepta,
                            userIdOfrece: appData.id_ofrece,
                            colorAcepta: appData.color_acepta,
                            colorOfrece: appData.color_ofrece,
                            nameAcepta: appData.name_acepta,
                            nameOfrece: appData.name_ofrece,
                        });}
                    });
                    this.bloques = mis_solicitudes;
                } catch(error){
                    console.error(error);
                }
            },

            async aceptarCambio(solicitud) {
                await db.collection('solicitudes-de-cambio').doc(solicitud.id).update({
                    estado: 'aceptado'
                });
                await db.collection('eventos').doc(solicitud.docIdAcepta).update({
                    user_name: solicitud.nameOfrece,
                    color: solicitud.colorOfrece,
                    user_id: solicitud.userIdOfrece,
                    available: false
                });
                await db.collection('eventos').doc(solicitud.docIdOfrece).update({
                    user_name: solicitud.nameAcepta,
                    color: solicitud.colorAcepta,
                    user_id: solicitud.userIdAcepta,
                    available: false
                });
                this.getSolicitudes();
                location.reload();
            },

            async rechazarCambio(key) {
                await db.collection('solicitudes-de-cambio').doc(key).update({
                    estado: 'rechazado'
                });
                this.getSolicitudes();
            }



        },

        filters: {
            formatDate (date) {
                return moment(date).format('DD-MM-YYYY HH:mm')
            },
        },

    }
</script>