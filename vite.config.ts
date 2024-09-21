import PhosphorUnplugin from '@phosphor-icons/unplugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		PhosphorUnplugin({
			framework: 'react',
			assetPath: '/assets/phosphor.svg', // Optional: Customize the asset path
		}),
	],
});
