import Vue from 'vue'
import VueRouter from 'vue-router'

import Material from 'materialize-css' // Components
// import 'materialize-css/sass/materialize.scss'
import 'materialize-css/dist/css/materialize.css' // CSS
import 'material-design-icons/iconfont/material-icons.css' // Icons

import root from './root'
import home from './home'
import setting from './setting'

const routes = [
    { name: 'root', path: '/', component: root },
    { name: 'home',  path: '/home', component: home },
    { name: 'setting', path: '/setting', component: setting },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

Vue.use(VueRouter)

new Vue({
    el: '#app',
    router: router,
    render: h => h(root)
})