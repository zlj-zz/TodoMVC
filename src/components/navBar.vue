<template>
    <div id="navBar">
        <!--!&#45;&#45; navbar &#45;&#45;-->
        <nav class="navbar navbar-expand-sm navbar-dark bg-success mb-3">
            <div class="container">
                <router-link class="navbar-brand" to="/">TodoMVC</router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/about">About</router-link>
                        </li>
                    </ul>

                    <ul class="navbar-nav ml-auto">

                        <li class="nav-item dropdown" v-if="isLogin">
                            <a href="#" class="nav-link" data-toggle="dropdown"
                                id="navbarDropdownMenuLink">欢迎 {{ userName }}</a>
                        </li>
                        <li class="nav-item" v-if="isLogin">
                            <a href="#" @click="logout()" class="nav-link">退出</a>
                        </li>
                        <li class="nav-item" v-if="!isLogin">
                            <router-link to="/users/login" class="nav-link">登录</router-link>
                        </li>
                        <li class="nav-item" v-if="!isLogin">
                            <router-link to="/users/register" class="nav-link">注册</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "navBar",
        data() {
            return {}
        },
        mounted() {
            console.log('dahj', JSON.parse(sessionStorage.getItem('userInof')))

        },
        computed: {
            isLogin() {
                let flage = this.$store.state.userId ? true : false;
                if (flage) {
                    this.userName = this.$store.state.userName;
                }
                return flage;
            }
        },
        methods: {
            logout() {
                this.axios.get('/api/users/logout')
                    .then(res => {
                        if (res.statusText === 'OK') {
                            this.$store.state.success_msg = res.data;
                            sessionStorage.clear();
                            this.$store.state.loginState = false;
                            this.$store.state.userId = JSON.parse(sessionStorage.getItem('userInfo'));
                            this.$router.push('/users/login');
                        }
                    })
            }
        },
    }
</script>

<style scoped>

</style>
