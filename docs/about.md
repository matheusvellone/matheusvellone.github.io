---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://github.com/matheusvellone.png',
    name: 'Matheus Vellone',
    title: 'SSE - Senior Silly Engineer',
    links: [
      { icon: 'github', link: 'https://github.com/matheusvellone' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/matheus-vellone/' },
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      About
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members />
</VPTeamPage>
