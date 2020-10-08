//import axios from '../../utils/axios'
import axios from 'axios'
import Swal from 'sweetalert2'

const state = {
    employees: [],
    positions: [],
    employeesFields: {
        name: { text: 'ФИО' },
        email: { text: 'Email' },
        birth_of_date: { text: 'Дата рождения' },
        position_id: { text: 'Должность' },
        salary: { text: 'Зарплата' }
    },
    api: {
        positions: '/api/positions',
        employee: '/api/employee'
    }
}

const getters = {
    employees: state => state.employees,
    employeesFields: state => state.employeesFields,
    positions: state => state.positions,
    api: state => state.api
}

const mutations = {
    setEmployees: (state, payload) => {
        state.employees = payload
    },
    setPositions: (state, payload) => {
        state.positions = payload
    }
}

const actions = {

    async getPositions(state, payload) {

        try {
            const response = await axios.get(state.getters.api.positions)

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (!response.data.success || response.data.success !== 1) throw new Error('Ошибка на сервере!')

            state.commit('setPositions', response.data.data)

        }
        catch (error) {
            console.log(error)
        }

    },

    async getEmployees(state, payload) {

        try {
            const response = await axios.get(state.getters.api.employee)

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (!response.data.success || response.data.success !== 1) throw new Error('Ошибка на сервере!')

            state.commit('setEmployees', response.data.data)

        }
        catch (error) {
            console.log(error)
        }

    },

    async createEmployee(state, payload) {

        try {

            for (let key in payload['data']) {
                if (!payload['data'][key]) throw new Error(`Параметр "${key}" пуст!`);
            }

            const response = await axios.post(state.getters.api.employee, { ...payload['data'] } )

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (!response.data.success || response.data.success !== 1) throw new Error('Ошибка на сервере!')

            await state.dispatch('getEmployees')

            if (payload.callback && typeof(payload.callback) == 'function') payload.callback()


        }
        catch (error) {
            console.log(error)
        }

    },

    async updateEmployee(state, payload) {

        try {

            for (let key in payload['data']) {
                if (!payload['data'][key]) throw new Error(`Параметр "${key}" пуст!`);
            }

            const response = await axios.patch(state.getters.api.employee, { ...payload['data'] } )

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (!response.data.success || response.data.success !== 1) throw new Error('Ошибка на сервере!')

            await state.dispatch('getEmployees')

            if (payload.callback && typeof(payload.callback) == 'function') payload.callback()


        }
        catch (error) {
            console.log(error)
        }

    },

    deleteEmployee(state, payload) {

        if (!payload.id) return
        const employee = state.getters.employees.find(u => u.id == payload.id)

        if (!employee) return

        Swal.fire({
            title: 'Удалить данного пользователя?',
            text: `Пользователь "${employee.name}" будет удалён!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет'
        }).then(async result => {
            if (!result.isConfirmed) return
            await axios.delete(`${state.getters.api.employee}/${payload.id}`)

            await state.dispatch('getEmployees')
        })

    }

}

export default {
    state,
    getters,
    mutations,
    actions
}
