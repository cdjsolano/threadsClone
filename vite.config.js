import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],

  build: {
     optimizeDeps: {
       include: ['lucide-react', 'react-toastify']
     },
      rollupOptions: {
      input: './index.html'
    }
  }
})
