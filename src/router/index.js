import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
import Layout from '../views/layout/Layout';


/* error page*/
const Err404 = resolve => require(['../views/error/404'], resolve);
const Err401 = resolve => require(['../views/error/401'], resolve);

/* login*/
import Login from '../views/login/';
import authRedirect from '../views/login/authredirect';
import sendPWD from '../views/login/sendpwd';
import reset from '../views/login/reset';

const Index = resolve => require(['../views/index/index'], resolve);

/* Task Manage*/
const TaskManage = resolve => require(['../views/taskManage/index'], resolve);
const TaskAdd = resolve => require(['../views/taskManage/taskAdd'], resolve);
const GroupManage = resolve => require(['../views/taskManage/groupManage'], resolve);
const GroupAdd = resolve => require(['../views/taskManage/groupAdd'], resolve);

/* Task View*/
const SubTaskView = resolve => require(['../views/taskView/subTaskView'], resolve);
const DutrationView = resolve => require(['../views/taskView/durationView'], resolve);
const LogView = resolve => require(['../views/taskView/logView'], resolve);
const TreeView = resolve => require(['../views/taskView/treeView'], resolve);

/* Introduction*/
const Introduction = resolve => require(['../views/introduction/index'], resolve);

/* charts*/
const LineMarker = resolve => require(['../views/charts/line'], resolve);
const MixChart = resolve => require(['../views/charts/mixchart'], resolve);

/* error log*/
// const ErrorLog = resolve => require(['../views/errlog/index'], resolve);

/* icon doc*/
const IconDoc = resolve => require(['../views/iconDoc/index'], resolve);

/* permission */
const Permission = resolve => require(['../views/permission/index'], resolve);


Vue.use(Router);

 /**
  * icon :the icon show in the sidebar
  * hidden: if hiddenLtrue will not show in the sidebar
  * redirect :if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta: { role: ['admin'] }  will control the page role
  */
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/sendpwd', component: sendPWD, hidden: true },
    { path: '/reset', component: reset, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
    // { path: '/logView/:taskId', name: 'logView', component: LogView},
    // {
    //   path: '/',
    //   component: Layout,
    //   redirect: '/',
    //   name: '首页',
    //   hidden: true,
    //   children: [{ path: '', component:  }]
    // },
    {
      path: '',
      component: Layout,
      redirect: '/index',
      icon: 'home',
      noDropdown: true,
      meta: { role: ['admin','editor','developer'] },
      children: [{ path: 'index', component: Index, name: '首页' }]
    },
    {
      path: '/manage',
      component: Layout,
      redirect: '/manage/taskManage',
      name: '管理调度任务',
      icon: 'layers',
      meta: { role: ['admin'] },
      children: [
          { path: 'taskManage', component: TaskManage, name: '编辑调度任务' },
          { path: 'taskAdd', component: TaskAdd, name: '新增调度任务' },
          { path: 'groupManage', component: GroupManage, name: '管理任务组' },
          { path: 'groupAdd', component: GroupAdd, name: '新增任务组' }
      ]
    },
    {
      path: '/view',
      component: Layout,
      redirect: '/view/subTaskView',
      name: '查看调度任务',
      icon: 'activity',
      meta: { role: ['admin'] },
      children: [
          { path: 'subTaskView', component: SubTaskView, name: '查看子任务状态' },
          { path: 'treeView', component: TreeView, name: '树形血缘图' },
          { path: 'dutrationView', component: DutrationView, name: '调度执行时间' },
          { path: 'logView/:taskId', component: LogView, name: 'Log', hidden:true }
      ]
    },
    // {
    //   path: '/permission',
    //   component: Layout,
    //   redirect: '/permission/index',
    //   name: '权限测试',
    //   icon: 'lock',
    //   meta: { role: ['admin'] },
    //   noDropdown: true,
    //   children: [{ path: 'index', component: Permission, name: '权限测试', meta: { role: ['admin'] } }]
    // },
    {
      path: '/charts',
      component: Layout,
      redirect: '/charts/line',
      name: '图表',
      icon: 'chart-bars',
      children: [
          { path: 'line', component: LineMarker, name: '折线图' },
          { path: 'mixchart', component: MixChart, name: '混合图表' }
      ]
    },
    {
      path: '/errorpage',
      component: Layout,
      redirect: 'noredirect',
      name: '错误页面',
      icon: 'warning',
      children: [
          { path: '401', component: Err401, name: '401' },
          { path: '404', component: Err404, name: '404' }
      ]
    },
    {
      path: '/icon',
      component: Layout,
      redirect: 'noredirect',
      name: '图标库',
      icon: 'diamond',
      noDropdown: true,
      children: [ { path: 'icon', component: IconDoc, name: '图标库' }]
    },
    // {
    //   path: '/errlog',
    //   component: Layout,
    //   redirect: 'noredirect',
    //   name: 'errlog',
    //   icon: 'bug',
    //   noDropdown: true,
    //   children: [{ path: 'log', component: ErrorLog, name: '执行日志' }]
    // },


    { path: '*', redirect: '/404', hidden: true }
  ]
});
