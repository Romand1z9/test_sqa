<template>
    <div class="login-form">
        <v-card class="login-card-form" width="500px">
            <v-card-text class="pt-4">
                <div>
                    <v-form ref="form">
                        <v-text-field
                            label="Логин"
                            v-model="login"
                            required
                        ></v-text-field>
                        <v-text-field
                            type="password"
                            label="Пароль"
                            v-model="password"
                            required
                        ></v-text-field>
                        <v-layout justify-center>
                            <v-btn
                                @click="submit"
                                :class=" { 'blue darken-4 white--text' : valid, disabled: !valid }">
                                Войти
                            </v-btn>
                        </v-layout>
                    </v-form>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "LoginForm",
    data () {
        return {
            password: '',
            login: '',
        }
    },
    computed: {
        valid() {
            return this.login.trim().length > 0 && this.password.trim().length > 0
        }
    },
    beforeDestroy() {
        this.login = ''
        this.password = ''
    },
    methods: {
        submit() {
            if (!this.valid) return

            this.$store.dispatch('login', {
                login: this.login,
                password: this.password,
                callback: () => {
                    this.$emit('showTable')
                }
            })

        }
    },
}
</script>

<style scoped>
    .login-form {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .login-card-form {
        margin-top: -100px;
    }
</style>
