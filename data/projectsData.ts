interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  { title: '墨帖', description: '书法碑帖检索与欣赏', href: 'https://ink.ason.top' },
  { title: '工具站', description: '日常开发与小工具集合', href: 'https://tools.ason.top' },
  { title: '画廊', description: '作品与影像展示', href: 'https://gallery.ason.top' },
]

export default projectsData
