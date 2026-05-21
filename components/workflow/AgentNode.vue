<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{
  data: {
    label: string
    emoji?: string
    color?: string
    department?: string
    departmentLabel?: string
    status?: 'pending' | 'running' | 'completed' | 'failed'
  }
}>()

const statusColors: Record<string, string> = {
  running: 'rgba(59, 130, 246, 0.4)',
  completed: 'rgba(16, 185, 129, 0.4)',
  failed: 'rgba(239, 68, 68, 0.4)',
  pending: 'transparent',
}

const pulseClass = props.data.status === 'running' ? 'animate-pulse-glow' : ''
</script>

<template>
  <div
    class="agent-node relative bg-white rounded-2xl px-4 py-3 border-2 border-ink-muted/10 shadow-card transition-shadow hover:shadow-card-hover min-w-[180px]"
    :class="pulseClass"
    :style="{ boxShadow: data.status === 'running' ? `0 0 0 0 ${statusColors.running}` : undefined }"
  >
    <Handle type="target" :position="Position.Left" class="!w-3 !h-3 !bg-brand-sky !border-2 !border-white" />
    <div class="flex items-center gap-2.5">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
        :style="{ background: `linear-gradient(135deg, ${data.color || '#7C3AED'}15, ${data.color || '#3B82F6'}10)` }"
      >
        {{ data.emoji || '🤖' }}
      </div>
      <div class="min-w-0">
        <div class="font-medium text-sm text-ink-heading truncate">{{ data.label }}</div>
        <span v-if="data.departmentLabel" :class="`dept-tag dept-tag--${data.department} text-[10px] px-2 py-0`">
          {{ data.departmentLabel }}
        </span>
      </div>
    </div>
    <!-- Status indicator -->
    <div v-if="data.status === 'completed'" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-white text-[10px]">✓</div>
    <div v-if="data.status === 'running'" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-sky border-2 border-white flex items-center justify-center text-white text-[10px]">⟳</div>
    <Handle type="source" :position="Position.Right" class="!w-3 !h-3 !bg-brand-violet !border-2 !border-white" />
  </div>
</template>
