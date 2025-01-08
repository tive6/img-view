import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  content: {
    filesystem: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  },
  presets: [presetUno()],
})
