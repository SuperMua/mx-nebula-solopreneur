export default defineEventHandler(() => {
  const departments: Record<string, { department: string; label: string; emoji: string }> = {
    engineering: { department: 'engineering', label: '工程部', emoji: '🛠️' },
    design: { department: 'design', label: '设计部', emoji: '🎨' },
    marketing: { department: 'marketing', label: '营销部', emoji: '📢' },
    'paid-media': { department: 'paid-media', label: '付费媒体部', emoji: '💸' },
    sales: { department: 'sales', label: '销售部', emoji: '💼' },
    finance: { department: 'finance', label: '金融部', emoji: '🏦' },
    hr: { department: 'hr', label: '人力资源部', emoji: '👔' },
    legal: { department: 'legal', label: '法务部', emoji: '⚖️' },
    'supply-chain': { department: 'supply-chain', label: '供应链部', emoji: '🚚' },
    product: { department: 'product', label: '产品部', emoji: '📦' },
    'project-management': { department: 'project-management', label: '项目管理部', emoji: '📋' },
    testing: { department: 'testing', label: '测试部', emoji: '🧪' },
    support: { department: 'support', label: '支持部', emoji: '📞' },
    specialized: { department: 'specialized', label: '专项部', emoji: '🔬' },
    'spatial-computing': { department: 'spatial-computing', label: '空间计算部', emoji: '🥽' },
    'game-development': { department: 'game-development', label: '游戏开发部', emoji: '🎮' },
    academic: { department: 'academic', label: '学术部', emoji: '📚' },
    strategy: { department: 'strategy', label: '战略部', emoji: '♟️' },
  }

  return {
    success: true,
    data: Object.values(departments),
  }
})
