import { defineConfig } from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: true,
    setupNodeEvents (on, config) {
      codeCoverageTask(on, config)
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config
    }
  }
})
