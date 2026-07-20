import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// PrimeVue с темой Aura; тёмный режим отключён — дизайн-система светлая.
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: false },
  },
})

// Сервис диалогов подтверждения (используется при удалении задач)
app.use(ConfirmationService)

// Директива v-tooltip для имени исполнителя на аватаре
app.directive('tooltip', Tooltip)

app.mount('#app')
