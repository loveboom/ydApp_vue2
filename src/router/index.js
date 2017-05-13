// import Vue from 'vue'
// import Router from 'vue-router'
// import Hello from '@/components/Hello'

// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Hello',
//       component: Hello
//     }
//   ]
// })


import App from '../App'

const Login = r => require.ensure([], () => r(require('@/components/login/index')), 'login')
const Statistics = r => require.ensure([], () => r(require('@/components/statistics/index')), 'statistics')
const Team = r => require.ensure([], () => r(require('@/components/team/index')), 'team')
const Entering = r => require.ensure([], () => r(require('@/components/entering')), 'entering')
const NotFoundComponent = r => require.ensure([], () => r(require('@/components/NotFoundComponent')), 'RegisNotFoundComponent')

export default [{
    path: '/',
    component: App, //顶层路由，对应App.vue
    children: [ //二级路由
        {//地址为空时跳转
            path: '',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/statistics',
            component: Statistics,
        },
        {
            path: '/team',
            component: Team,
        },
        {
            path: '/entering',
            component: Entering,
        },
        {
            path: '*',
            component: NotFoundComponent,
        },
    ]
}]
