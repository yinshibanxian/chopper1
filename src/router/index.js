import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }
  ]
  },
  {
    path: '/chopper',
    component: () => import('@/views/Detail/index'),
    redirect: 'chopper-detail',
    children: [
      {
        path: '/chopper-detail',
        name: 'chopper detail',
        component: () => import('@/views/Detail/index')
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '运维记录查询', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/InspectionRecord/index'),
        meta: { title: '巡检记录', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '故障记录', icon: 'tree' }
      },
      {
        path: '/maintenance',
        name: 'maintenance',
        component: () => import('@/views/operationAndMatainManagement'),
        meta: { title: '检修维护记录', icon: 'tree' }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  {
    path: '/equipment-management',
    component: Layout,
    redirect: '/equipment-management/spect',
    name: 'Equipment',
    meta: {
      title: '设备管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'spect',
        component: () => import('@/views/EquipmentManagement/Spect'), // Parent router-view
        name: 'Spect',
        meta: { title: '谱仪管理' },
      },
      {
        path: 'chopper',
        component: () => import('@/views/EquipmentManagement/Chopper'),
        name: 'Menu2',
        meta: { title: '斩波器管理' }
      },
      {
        path: 'standard-management',
        component: () => import('@/views/EquipmentManagement/StandardManagement'),
        name: 'standardManagement',
        meta: { title: '参数管理' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
