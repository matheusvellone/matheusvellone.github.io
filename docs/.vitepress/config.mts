import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Matheus Vellone",
  description: "Just A Silly Guy Writing Silly Code",
  cleanUrls: true,
  lang: "en",
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/matheusvellone/matheusvellone.github.io",
      },
    ],
    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
      link: "/",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "About", link: "/about" },
        ],
        footer: {
          message:
            "Made with ❤️ using <a href='https://vitepress.dev' target='_blank'>VitePress</a> and <a href='https://pages.github.com' target='_blank'>Github Pages</a>",
          copyright:
            "Copyright © 2025-present <a href='https://github.com/matheusvellone' target='_blank'>Matheus Vellone</a>",
        },
      },
    },
    // pt: {
    //   label: "Português",
    //   lang: "pt-BR",
    //   link: "/pt/",
    //   themeConfig: {
    //     outline: {
    //       label: "Nesta página",
    //     },
    //     nav: [
    //       { text: "Home", link: "/pt/" },
    //       { text: "Guias", link: "/pt/guides" },
    //       { text: "Sobre", link: "/pt/about" },
    //     ],
    //     sidebar: {
    //       "/pt/guides/": [
    //         {
    //           text: "Guias",
    //           items: [
    //             {
    //               text: "Manual de Sobrevivência do Tech Lead",
    //               link: "/pt/guides/tech-lead-survival-guide",
    //             },
    //             {
    //               text: "Code Review",
    //               collapsed: false,
    //               items: [
    //                 {
    //                   text: "Guia Básico de Code Review",
    //                   link: "/pt/guides/code-review/basic-guide",
    //                 },
    //                 {
    //                   text: "Checklist de Code Review",
    //                   link: "/pt/guides/code-review/checklist",
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     footer: {
    //       message:
    //         "Feito com ❤️ usando <a href='https://vitepress.dev' target='_blank'>VitePress</a> e <a href='https://pages.github.com' target='_blank'>Github Pages</a>",
    //       copyright:
    //         "Copyright © 2025-presente <a href='https://github.com/matheusvellone' target='_blank'>Matheus Vellone</a>",
    //     },
    //   },
    // },
  },
  // ignoreDeadLinks: ["/pt/guides", "/pt/blog"],
});
