<template>
    <v-row justify="center">
        <v-dialog
            v-model="dialog"
            @click:outside="$emit('closeDialog')"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">
                        {{ mode === 'edit' && employeeInfo['name'] ? `Редактировать: ${employeeInfo['name']}` : 'Новый пользователь' }}
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col v-for="(value, field) in employeeInfo" :key="field" cols="12">
                                <v-text-field v-if="field === 'email'"
                                    :label="fields[field]['text']"
                                    required
                                    type="email"
                                    v-model.trim.lazy="employeeInfo[field]"
                                ></v-text-field>
                                <v-text-field
                                    v-else-if="field === 'salary'"
                                    :label="fields[field]['text']"
                                    required
                                    type="number"
                                    v-model.trim.lazy.number="employeeInfo[field]"
                                ></v-text-field>
                                <v-select v-else-if="field === 'position_id'"
                                    v-model.trim.lazy="employeeInfo[field]"
                                    :label="fields[field]['text']"
                                    :items="positions"
                                    item-value="id"
                                    item-text="name"
                                    solo
                                    dense
                                    required
                                ></v-select>
                                <v-menu v-else-if="field === 'birth_of_date'"
                                    v-model="datepicker.menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="employeeInfo[field]"
                                            :label="fields[field]['text']"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="employeeInfo[field]"
                                        @input="datepicker.menu2 = false"
                                        locale="ru"
                                    ></v-date-picker>
                                </v-menu>
                                <v-text-field v-else
                                    :label="fields[field]['text']"
                                    required
                                    v-model.trim.lazy="employeeInfo[field]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="submitButtonHandler"
                    >
                        {{ mode === 'edit' ? 'Сохранить' : 'Создать' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>

import moment from 'moment'

export default {
    name: "EmployeeModal",
    props: ['active', 'mode', 'employee'],
    data: () => ({
        dialog: false,
        employeeInfo: {},
        datepicker: {
            //date: new Date().toISOString().substr(0, 10),
            //date: moment("19700101").format('YYYY-MM-DD'),
            menu: false,
            modal: false,
            menu2: false,
        }
    }),
    computed: {
        fields() {
            return this.$store.getters.employeesFields
        },
        positions() {
            return this.$store.getters.positions
        }
    },
    watch: {
        active: function (value, oldValue) {
            this.dialog = value
        },
        dialog: function (value, oldValue) {
            if (!value) {
                this.$emit('closeDialog')
            }
        }
    },
    created() {
        this.employeeInfo = {
            ...this.$props.employee,
            birth_of_date: moment(this.$props.employee['birth_of_date'], "DD.MM.YYYY").format('YYYY-MM-DD')
        }
        delete this.employeeInfo['id']
        this.dialog = true
    },
    destroyed() {
        this.employeeInfo = {}
    },
    methods: {
        submitButtonHandler() {

            const callback = () => {
                this.dialog = false
            }

            if (this.$props.mode === 'edit') {
                this.$store.dispatch('updateEmployee', {
                    data: {
                        id: this.$props.employee.id,
                        ...this.employeeInfo,
                        birth_of_date: moment(this.employeeInfo['birth_of_date'], 'YYYY-MM-DD').format('DD.MM.YYYY')
                    },
                    callback
                })
            }

            if (this.$props.mode === 'create') {
                this.$store.dispatch('createEmployee', {
                    data: { ...this.employeeInfo, birth_of_date: moment(this.employeeInfo['birth_of_date'], 'YYYY-MM-DD').format('DD.MM.YYYY') },
                    callback
                })
            }

            return
        }
    }
}
</script>

<style scoped></style>
