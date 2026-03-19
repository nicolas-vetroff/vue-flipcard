import { createApp } from 'vue'
import App from './App.vue'
import VueFlip from '../src' // src/index.ts

const app = createApp(App)
app.use(VueFlip)
app.mount('#app')
