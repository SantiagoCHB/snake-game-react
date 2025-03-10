import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/snake-game-react/', // 👈 Usa el nombre de tu repositorio aquí
});
