<template>
    <div @click="employeesTableClickHandler">
        <v-data-table
            :headers="headers"
            :items="employees"
            sort-by="name"
            class="elevation-1"
            hide-default-footer
        >
            <template v-slot:top>
                <v-toolbar
                    flat
                >
                    <v-toolbar-title>Сотрудники</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="#00BFA5"
                        dark
                        class="mb-2 mr-4"
                        @click="$store.dispatch('getEmployees')"
                    >
                        <v-icon>
                            mdi-refresh
                        </v-icon>
                    </v-btn>
                    <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="addEmployeeButtonHandler"
                    >
                        Добавить
                    </v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.position_id="{ item }">
                {{ item.position }}
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="icon-actions" :data-id="item.id">
                    <v-icon
                        medium
                        color="#64B5F6"
                        class="mr-2 edit-employee-icon"
                        title="Изменить"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        medium
                        color="#F44336"
                        class="delete-employee-icon"
                        title="Удалить"
                    >
                        mdi-delete
                    </v-icon>
                </div>
            </template>
            <template v-slot:no-data>
                Список сотрудников пуст
            </template>
        </v-data-table>
        <EmployeeModal
            v-if="modal.active"
            :active="modal.active"
            :mode="modal.mode"
            :employee="modal.data"
            @closeDialog="modal.active = false, modal.data = {}"
        />
    </div>
</template>

<script>

import EmployeeModal from "./EmployeeModal"

export default {
    name: "EmployeesTable",
    components: {
        EmployeeModal
    },
    data: () => ({
        headers: [
            {
                text: 'ФИО',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Email', value: 'email' },
            { text: 'Дата рождения', value: 'birth_of_date' },
            { text: 'Должность', value: 'position_id' },
            { text: 'Зарплата', value: 'salary' },
            { text: '', value: 'actions', sortable: false },
        ],
        modal: {
            active: false,
            mode: 'create',
            data: {

            }
        },
    }),
    computed: {
        employees() {
            return this.$store.getters.employees
        },
        positions() {
            return this.$store.getters.positions
        }
    },
    created() {
        this.$store.dispatch('getEmployees')
    },
    methods: {
        employeesTableClickHandler(e) {

            if (e.target.tagName.toLowerCase() !== 'i') return

            if (e.target.classList.contains('delete-employee-icon')) {
                this.$store.dispatch('deleteEmployee', {
                    id: +e.target.closest('.icon-actions').dataset.id
                })
                return
            }

            if (e.target.classList.contains('edit-employee-icon')) {
                this.editEmployee(+e.target.closest('.icon-actions').dataset.id)
            }

        },
        addEmployeeButtonHandler() {
            this.modal['mode'] = 'create'
            this.modal['data'] = {
                id: null,
                name: '',
                email: '',
                birth_of_date: '01.01.1970',
                position_id: 0,
                salary: 10000
            }
            this.modal['active'] = true
        },
        editEmployee(employee_id) {

            if (!employee_id) return

            const employee = this.employees.find(e => e.id == employee_id)

            if (!employee) return

            this.modal['mode'] = 'edit'
            this.modal['data'] = { ...employee }
            this.modal['active'] = true
            return

        }
    }
}
</script>

<style lang="scss" scoped>
    .icon-actions > i {
        cursor: pointer;
    }
</style>
