const SUPPORTED_TOOLS = [
  { id: 'claude-code', name: 'Claude Code', icon: '🟣', category: 'cli' },
  { id: 'cursor', name: 'Cursor', icon: '⬛', category: 'ide' },
  { id: 'windsurf', name: 'Windsurf', icon: '🌊', category: 'ide' },
  { id: 'copilot', name: 'GitHub Copilot', icon: '🐙', category: 'ide' },
  { id: 'cogent', name: 'Cogent', icon: '🧠', category: 'cli' },
  { id: 'gemini-cli', name: 'Gemini CLI', icon: '💎', category: 'cli' },
  { id: 'opencode', name: 'OpenCode', icon: '🔓', category: 'cli' },
  { id: 'qwen-code', name: 'Qwen Code', icon: '🤖', category: 'cli' },
  { id: 'codex-cli', name: 'Codex CLI', icon: '📟', category: 'cli' },
  { id: 'walle', name: 'Walle', icon: '🤖', category: 'cli' },
  { id: 'auggie', name: 'Auggie', icon: '🦜', category: 'cli' },
  { id: 'sim', name: 'SIM', icon: '📱', category: 'cli' },
  { id: 'amazon-q', name: 'Amazon Q', icon: '☁️', category: 'cli' },
  { id: 'roo-code', name: 'Roo Code', icon: '🦘', category: 'ide' },
  { id: 'kilo-code', name: 'Kilo Code', icon: '⚡', category: 'ide' },
  { id: 'github-skills', name: 'GitHub Skills', icon: '🎓', category: 'platform' },
  { id: 'piece', name: 'Piece', icon: '🧩', category: 'platform' },
]

export default defineEventHandler(() => {
  return {
    success: true,
    data: SUPPORTED_TOOLS,
  }
})
