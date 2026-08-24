export interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  color?: string
  colorDark?: string
  perms?: string
}

const projectsData: Project[] = [
  {
    title: '墨帖',
    description: '书法碑帖检索与欣赏',
    href: 'https://ink.ason.top',
    color: '#20252B',
    colorDark: '#9aa6b2',
    perms: '-rw-r--r--',
  },
  {
    title: '画廊',
    description: 'AI作品与影像展示',
    href: 'https://gallery.ason.top',
    color: '#d95e10',
    colorDark: '#f59e0b',
    perms: '-rw-r--r--',
  },
  {
    title: '工具站',
    description: '日常开发与小工具集合',
    href: 'https://tools.ason.top',
    color: '#6366f1',
    colorDark: '#818cf8',
    perms: '-rw-r--r--',
  },
  {
    title: '临盘',
    description: '实时盘面数据与分析',
    href: 'https://pan.ason.top',
    color: '#10b981',
    colorDark: '#34d399',
    perms: '-rw-r--r--',
  },
]

export default projectsData
