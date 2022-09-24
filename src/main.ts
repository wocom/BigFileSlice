import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

import { Spin, Progress, Table, Button } from 'ant-design-vue'
import 'ant-design-vue/es/Spin/style/css';
import 'ant-design-vue/es/Progress/style/css';
import 'ant-design-vue/es/Table/style/css';
import 'ant-design-vue/es/Button/style/css';


createApp(App).use(Spin).use(Progress).use(Table).use(Button).mount('#app')
