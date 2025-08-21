import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ['lucide-react'], // aquí sí lo toma en cuenta
  },
    rollupOptions: {
      input: './index.html',
      external: ['react-toastify',
        'react-toastify/dist/ReactToastify.css']
    }
  
})
