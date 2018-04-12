import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

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
Vue.use(ElementUI)

new Vue({
    el: '#app',
    router: router,
    render: h => h(root)
})