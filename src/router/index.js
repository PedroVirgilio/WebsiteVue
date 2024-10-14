import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/Homepage.vue';
import TodoApp from '../components/TodoApp.vue';
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import ProfilePage from '../components/ProfilePage.vue';
import AdminPage from '@/views/AdminPage.vue';
import WeatherApp from '@/components/WeatherApp.vue';
import ExpenseTracker from '../components/ExpenseTracker.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '/profile',
    component: ProfilePage,
  },
  {
    path: '/todo',
    name: 'Todo',
    component: TodoApp,
  },
  {
    path: '/project-management',
    name: 'ProjectManagement',
    component: () => import('@/views/ProjectManagement.vue')
  },
  { 
    path: '/admin', 
    component: AdminPage, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/weather', 
    component: WeatherApp 
  },
  {
    path: '/expense-tracker',
    name: 'ExpenseTracker',
    component: ExpenseTracker,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
