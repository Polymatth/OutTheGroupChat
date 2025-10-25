import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    include: ['**/*.js', '**/*.jsx']  // Add this line to process .js files as JSX
  })],
  server: {
    port: 3000
  }
})