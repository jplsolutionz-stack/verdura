import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH=/verdura/ na publicação do GitHub Pages; "/" no desenvolvimento.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    // Sintaxe compatível com navegadores de 2020 em diante (iOS 14, Chrome 87).
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
  },
})
