<script setup lang="ts">
const emit = defineEmits<{
  addAgent: [agent: any]
}>()

const { data: deptData } = await useAsyncData('wfdeps', () => $fetch('/api/v1/departments'))
const departments = computed(() => (deptData.value as any)?.data || [])

const selectedDept = ref('all')
const searchQuery = ref('')

const { data: agentList } = await useAsyncData(
  'wfagents',
  () => $fetch('/api/v1/agents', { query: { limit: 200, sort: 'name' } }),
)

const filteredAgents = computed(() => {
  const list = (agentList.value as any)?.data || []
  return list.filter((a: any) => {
    if (selectedDept.value !== 'all' && a.department !== selectedDept.value) return false
    if (searchQuery.value && !a.name.includes(searchQuery.value) && !a.description.includes(searchQuery.value)) return false
    return true
  })
})

function onDragStart(event: DragEvent, agent: any) {
  event.dataTransfer!.setData('application/json', JSON.stringify(agent))
  event.dataTransfer!.effectAllowed = 'move'
}
</script>

<template>
  <div class="h-full flex flex-col bg-white/60 backdrop-blur-sm border-l border-ink-muted/10">
    <div class="p-4 border-b border-ink-muted/10">
      <h3 class="font-semibold text-ink-heading text-sm mb-3">Agent 选择器</h3>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索 Agent..."
        class="w-full px-3 py-2 rounded-xl border border-ink-muted/20 bg-white/60 text-sm text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 mb-2"
      />
      <select
        v-model="selectedDept"
        class="w-full px-3 py-2 rounded-xl border border-ink-muted/20 bg-white/60 text-sm text-ink-heading focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
      >
        <option value="all">全部部门</option>
        <option v-for="d in departments" :key="d.department" :value="d.department">{{ d.emoji }} {{ d.label }}</option>
      </select>
    </div>
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <div
        v-for="agent in filteredAgents"
        :key="agent.slug"
        draggable="true"
        @dragstart="onDragStart($event, agent)"
        class="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-ink-muted/10 cursor-grab active:cursor-grabbing hover:shadow-card hover:border-brand-violet/20 transition-all duration-200"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
          :style="{ background: `linear-gradient(135deg, ${agent.color || '#7C3AED'}15, ${agent.color || '#3B82F6'}10)` }"
        >
          {{ agent.emoji || '🤖' }}
        </div>
        <div class="min-w-0">
          <div class="text-sm font-medium text-ink-heading truncate">{{ agent.name }}</div>
          <span :class="`dept-tag dept-tag--${agent.department} text-[10px] px-1.5 py-0`">{{ agent.departmentLabel }}</span>
        </div>
      </div>
      <div v-if="filteredAgents.length === 0" class="text-center py-8 text-sm text-ink-muted">
        没有匹配的 Agent
      </div>
    </div>
  </div>
</template>
