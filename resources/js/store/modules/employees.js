//import axios from '../../utils/axios'
import axios from 'axios'
import Swal from 'sweetalert2'

const state = {
    employees: [
        {
            id: 1,
            name: 'Иванов Иван Иванович',
            email: 'ivanovx12@gmail.com',
            birth_of_date: '11.04.1983',
            position_id: 1,
            salary: 80000,
        },
        {
            id: 5,
            name: 'Петров Пётр Петрович',
            email: 'petrov1254@mail.ru',
            birth_of_date: '16.04.1988',
            position_id: 5,
            salary: 40000,
        },
        {
            id: 8,
            name: 'Сергеев Сергей Сергеевич',
            email: 'serg213@gmail.com',
            birth_of_date: '12.09.1991',
            position_id: 2,
            salary: 50000,
        }
    ],
    employeesFields: {
        name: { text: 'ФИО' },
        email: { text: 'Email' },
        birth_of_date: { text: 'Дата рождения' },
        position_id: { text: 'Должность' },
        salary: { text: 'Зарплата' }
    },
    positions: [
        { id: 1, name: 'Технический директор'},
        { id: 2, name: 'Web-Программист'},
        { id: 3, name: 'Дизайнер' },
        { id: 4, name: 'Тестировщик' },
        { id: 5, name: 'Менеджер по продажам' },
        { id: 6, name: 'Аккаунт-менеджер' },
    ]
}

const getters = {
    employees: state => state.employees,
    employeesFields: state => state.employeesFields,
    positions: state => state.positions
}

const mutations = {
    setEmployees: (state, payload) => {
        state.employees = payload
    }
}

const actions = {

    getEmployees(state, payload) {
        axios.get('/api/users')
    },

    createEmployee(state, payload) {
        console.log('create', payload)

        for (let key in payload['data']) {
            if (!payload['data'][key]) return;
        }

        state.commit('setEmployees', [...state.getters.employees, { ...payload['data'], id: (new Date()).getTime() }])

        payload.callback()
    },

    updateEmployee(state, payload) {
        console.log('update', payload)

        for (let key in payload['data']) {
            if (!payload['data'][key]) return;
        }

        state.commit('setEmployees', state.getters.employees.map(u => {
            if (u.id == payload['data'].id) {
                u = { ...payload['data'] }
            }

            return u
        }))

        payload.callback()

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
        }).then((result) => {
            if (!result.isConfirmed) return
            state.commit('setEmployees', state.getters.employees.filter(u => u.id != payload.id))
        })

    }

}

export default {
    state,
    getters,
    mutations,
    actions
}
