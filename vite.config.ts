import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH=/verdura/ na publicação do GitHub Pages; "/" no desenvolvimento.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
