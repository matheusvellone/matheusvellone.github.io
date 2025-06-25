import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Matheus Vellone',
  description: 'An attempt to dump knowledge from my brain to the internet',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog' },
      { text: 'About', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/matheusvellone' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/matheus-vellone' },
    ],

    footer: {
      message: 'Made with ❤️ and 🤪 by Matheus Vellone',
    },
    search: {
      provider: 'local',
    },
  },
})
