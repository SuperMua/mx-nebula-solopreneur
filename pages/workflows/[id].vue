<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import AgentNode from '~/components/workflow/AgentNode.vue'
import AgentSelector from '~/components/workflow/AgentSelector.vue'

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const workflowId = computed(() => route.params.id as string)
const isNew = computed(() => workflowId.value === 'new')

const { nodes, edges, addNodes, addEdges, onConnect, onNodeClick, fitView, toObject } = useVueFlow({
  defaultEdgeOptions: {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#7C3AED', strokeWidth: 2 },
  },
})

// State
const workflowName = ref('新工作流')
const workflowDescription = ref('')
const isSaving = ref(false)
const showSidebar = ref(true)
const selectedNode = ref<any>(null)

// Load existing workflow
if (!isNew.value) {
  const { data: wfData } = await useAsyncData(`workflow-${workflowId.value}`, () =>
    $fetch(`/api/v1/workflows/${workflowId.value}`)
  )
  const wf = (wfData.value as any)?.data
  if (wf) {
    workflowName.value = wf.name
    workflowDescription.value = wf.description || ''
    if (wf.dagJson?.nodes) nodes.value = wf.dagJson.nodes
    if (wf.dagJson?.edges) edges.value = wf.dagJson.edges
  }
}

// Drag and drop handler
function onDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  const raw = event.dataTransfer?.getData('application/json')
  if (!raw) return

  const agent = JSON.parse(raw)
  const position = { x: event.offsetX - 90, y: event.offsetY - 30 }

  const id = `node-${Date.now()}`
  addNodes([{
    id,
    type: 'agent',
    position,
    data: {
      label: agent.name,
      emoji: agent.emoji,
      color: agent.color,
      department: agent.department,
      departmentLabel: agent.departmentLabel,
      agentSlug: agent.slug,
      status: 'pending',
    },
  }])
}

// Node click handler
onNodeClick(({ node }) => {
  selectedNode.value = node
})

// Connect handler
onConnect((connection) => {
  addEdges([{
    ...connection,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#7C3AED', strokeWidth: 2 },
  }])
})

// Save workflow
let saveError = ref('')

async function saveWorkflow() {
  saveError.value = ''
  if (!workflowName.value.trim()) {
    saveError.value = '请输入工作流名称'
    return
  }

  const dag = toObject()

  // Validate DAG
  const { validateDAG } = await import('~/server/utils/dag')
  const validation = validateDAG(dag.nodes, dag.edges)
  if (!validation.valid) {
    saveError.value = validation.message || '工作流配置无效'
    return
  }

  isSaving.value = true
  const payload = {
    name: workflowName.value,
    description: workflowDescription.value,
    dagJson: { nodes: dag.nodes, edges: dag.edges },
    isPublic: false,
  }

  try {
    if (isNew.value) {
      const res = await $fetch('/api/v1/workflows', { method: 'POST', body: payload })
      const id = (res as any).data.id
      await navigateTo(`/workflows/${id}`)
    } else {
      await $fetch(`/api/v1/workflows/${workflowId.value}`, { method: 'PUT', body: payload })
    }
  } catch (err: any) {
    console.error('Save failed:', err)
  } finally {
    isSaving.value = false
  }
}

// Keyboard shortcuts
function onKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    saveWorkflow()
  }
  if (e.key === 'Delete' && selectedNode.value) {
    const id = selectedNode.value.id
    nodes.value = nodes.value.filter(n => n.id !== id)
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id)
    selectedNode.value = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

useHead({ title: `${workflowName.value} - 工作流编辑器` })
</script>

<template>
  <div class="workflow-editor h-[calc(100vh-4rem)] flex">
    <!-- Main Canvas Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-ink-muted/10 bg-white/60 backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <NuxtLink to="/workflows" class="text-ink-muted hover:text-ink-body transition-colors">←</NuxtLink>
          <input
            v-model="workflowName"
            class="font-semibold text-ink-heading bg-transparent border-none outline-none text-sm w-48"
            placeholder="工作流名称"
          />
          <span v-if="saveError" class="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">{{ saveError }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="showSidebar = !showSidebar"
            class="px-3 py-1.5 text-xs rounded-lg border border-ink-muted/20 text-ink-body hover:bg-white/60 transition-colors"
          >
            {{ showSidebar ? '隐藏侧栏' : 'Agent 选择器' }}
          </button>
          <button
            @click="fitView({ padding: 0.2 })"
            class="px-3 py-1.5 text-xs rounded-lg border border-ink-muted/20 text-ink-body hover:bg-white/60 transition-colors"
          >
            适配视图
          </button>
          <button
            @click="saveWorkflow"
            :disabled="isSaving"
            class="btn-gradient text-xs px-4 py-1.5"
          >
            {{ isSaving ? '保存中...' : '💾 保存' }}
          </button>
        </div>
      </div>

      <!-- Canvas -->
      <div class="flex-1 relative" @dragover="onDragOver" @drop="onDrop">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="{ agent: AgentNode }"
          :default-viewport="{ zoom: 1, x: 0, y: 0 }"
          :min-zoom="0.2"
          :max-zoom="2"
          :snap-to-grid="true"
          :snap-grid="[16, 16]"
          fit-view-on-init
          class="bg-surface-base"
        >
          <Background :gap="16" pattern-color="#E2E8F0" />
          <Controls position="bottom-right" class="[&>button]:!bg-white [&>button]:!border-ink-muted/20 [&>button]:!rounded-xl" />
          <MiniMap
            position="bottom-left"
            class="!bg-white/80 !backdrop-blur !rounded-2xl !border !border-ink-muted/10 !shadow-card"
            :pannable="true"
            :zoomable="true"
            :node-stroke-color="'#7C3AED'"
            :node-color="(n: any) => n.data?.color || '#7C3AED'"
          />
        </VueFlow>

        <!-- Drop hint -->
        <div v-if="nodes.length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="text-center">
            <p class="text-6xl mb-4">🎬</p>
            <h3 class="text-xl font-semibold text-ink-heading mb-2">开始编排工作流</h3>
            <p class="text-ink-muted">从右侧拖拽 Agent 到画布，连线构建你的 AI 协作流程</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <AgentSelector v-if="showSidebar" class="w-72 shrink-0" />
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

.workflow-editor .vue-flow__pane {
  cursor: grab;
}
.workflow-editor .vue-flow__pane:active {
  cursor: grabbing;
}
</style>
