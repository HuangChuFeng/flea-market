import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/index'
import Items from '@/components/items'
import Detail from '@/components/detail'
import Personal from '@/components/personal'
import Published from '@/components/published'
import Collect from '@/components/collect'
import BuyIn from '@/components/buyin'
import Sale from '@/components/sale'
import Message from '@/components/chat/message'


Vue.use(Router)

export default new Router({
  routes: [	
    {
    	path: '/',
    	name: 'Index',
        redirect: '/index',
    	component: Index,
        children: [
        ]
    },
    { path: '/index', component: Index },
    { 
        path: '/items', 
        component: Items,
        redirect: '/items/published',
        children: [
        { path: '/items/published', component: Published, meta: { requiresAuth: true }},
        { path: '/items/collect', component: Collect },
        { path: '/items/buyin', component: BuyIn },
        { path: '/items/sale', component: Sale },
        ]
    },
    {   path: '/message', 
        component: Message, 
        meta: { requiresAuth: true }
    },
    { path: '/personal', component: Personal, meta: { requiresAuth: true }},
    { path: '/index/detail/:id', component: Detail},
    { path: '/index/detail', component: Detail},
  ]
})
