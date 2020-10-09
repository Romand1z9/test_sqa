<template>
    <v-app>
        <LoginForm v-if="activeComponents.login" @showTable="showComponent('table')"/>
        <div v-else-if="activeComponents.table">
            <v-navigation-drawer app>
            </v-navigation-drawer>
            <v-app-bar app></v-app-bar>
            <v-main>
                <v-container fluid>
                    <EmployeesTable/>
                </v-container>
            </v-main>
            <v-footer app>
            </v-footer>
        </div>
    </v-app>
</template>

<script>

import EmployeesTable from "./EmployeesTable"
import LoginForm from "./LoginForm";

export default {
    name: "MainComponent",
    components: {
        LoginForm,
        EmployeesTable
    },
    data () {
        return {
            activeComponents: {
                login: true,
                table: false
            }
        }
    },
    methods: {
        showComponent(component = 'table') {

            if (!component) return

            for (let i in this.activeComponents) {
                this.activeComponents[i] = i == component ? true : false
            }

        }
    }


}
</script>

<style scoped></style>
