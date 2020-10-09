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
        employee: '/api/employee',
        login: '/api/admin/login',
    },
    loader: false
}

const getters = {
    employees: state => state.employees,
    employeesFields: state => state.employeesFields,
    positions: state => state.positions,
    api: state => state.api,
}

const mutations = {
    setEmployees: (state, payload) => {
        state.employees = payload
    },
    setPositions: (state, payload) => {
        state.positions = payload
    },
    setLoader: (state, payload) => {
        state.loader = payload
    }
}

const actions = {

    async login(state, payload) {

        try {
            const {login, password} = payload

            const response = await axios.post(state.getters.api.login, { login, password })

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (response.data.error) throw new Error(response.data.error)

            if (response.data.success && response.data.success !== 1) throw new Error('Ошибка на сервере!')

            if (payload.callback && typeof(payload.callback) == 'function') payload.callback()

        }
        catch (error) {
            showError(error.message)
        }


    },

    async getPositions(state, payload) {

        try {
            const response = await axios.get(state.getters.api.positions)

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (response.data.error) throw new Error(response.data.error)
            if (response.data.success && response.data.success !== 1) throw new Error('Ошибка на сервере!')

            state.commit('setPositions', response.data.data)

        }
        catch (error) {
            showError(error.message)
        }

    },

    async getEmployees(state, payload) {

        try {
            const response = await axios.get(state.getters.api.employee)

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
            if (response.data.error) throw new Error(response.data.error)
            if (response.data.success && response.data.success !== 1) throw new Error('Ошибка на сервере!')

            state.commit('setEmployees', response.data.data)

        }
        catch (error) {
            showError(error.message)
        }

    },

    async createEmployee(state, payload) {

        const loader = showLoader('Идёт создание...' )

        try {

            for (let key in payload['data']) {
                if (!payload['data'][key]) throw new Error(`Параметр "${key}" пуст!`);
            }

            const response = await axios.post(state.getters.api.employee, { ...payload['data'] } )

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')

            if (response.data.error && response.data.error_data) {

                let error_data = '';

                for (let e in response.data.error_data) {
                    error_data += `<p> ${Object.values(response.data.error_data[e]).join("<br>")} </p>`
                }

                throw new Error(error_data)
            }

            if (response.data.error) throw new Error(response.data.error)

            if (response.data.success && response.data.success !== 1) throw new Error('Ошибка на сервере!')

            await state.dispatch('getEmployees')

            if (payload.callback && typeof(payload.callback) == 'function') payload.callback()


        }
        catch (error) {
            showError(error.message)
        }
        finally {
            loader.close()
        }

    },

    async updateEmployee(state, payload) {

        const loader = showLoader('Идёт обновление...' )

        try {

            for (let key in payload['data']) {
                if (!payload['data'][key]) throw new Error(`Параметр "${key}" пуст!`);
            }

            const response = await axios.patch(state.getters.api.employee, { ...payload['data'] } )

            if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')

            if (response.data.error && response.data.error_data) {

                let error_data = '';

                for (let e in response.data.error_data) {
                    error_data += `<br> ${Object.values(response.data.error_data[e]).join("<br>")}`
                }

                throw new Error(error_data)
            }

            if (response.data.error) throw new Error(response.data.error)
            if (response.data.success && response.data.success !== 1) throw new Error('Ошибка на сервере!')

            await state.dispatch('getEmployees')

            if (payload.callback && typeof(payload.callback) == 'function') payload.callback()


        }
        catch (error) {
            showError(error.message)
        }
        finally {
            loader.close()
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

            const loader = showLoader('Идёт удаление...' )

            try {

                const response = await axios.delete(`${state.getters.api.employee}/${payload.id}`)

                if (response.status !== 200) throw new Error('Ошибка при запросе к серверу!')
                if (response.data.error) throw new Error(response.data.error)
                if (response.data.success && response.data.success !== 1) throw new Error('Ошибка на сервере!')

                await state.dispatch('getEmployees')
            }
            catch (error) {
                showError(error.message)
            }
            finally {
                loader.close()
            }

        })

    },

}

function showLoader(text) {

    return Swal.fire({
        position: 'center',
        icon: 'info',
        title: text ? text : 'Идёт обработка...',
        allowOutsideClick: false,
        timer: false,
        willOpen: (val) => {
            Swal.showLoading()
        },
    })

}

function showError(error = 'Ошибка') {
    Swal.fire({
        title: 'Ошибка!',
        icon: 'error',
        html: error.toString()
    })
}

export default {
    state,
    getters,
    mutations,
    actions
}
