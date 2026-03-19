import { createApp } from 'vue'
import App from './App.vue'
import VFlipCard from '../src' // src/index.ts

const app = createApp(App)
app.use(VFlipCard)
app.mount('#app')
