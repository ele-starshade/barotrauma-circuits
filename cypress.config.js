import { defineConfig } from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: true,
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    experimentalStudio: true,
    setupNodeEvents (on, config) {
      codeCoverageTask(on, config)

      // include any other plugin code...
      return config
    }
  }
})
