<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core'

const props = defineProps<{
  node: any
}>()

const emit = defineEmits<{
  close: []
  update: [nodeId: string, data: Record<string, any>]
}>()

const { removeNodes } = useVueFlow('workflow-editor')

const label = ref(props.node.data?.label || '')
const description = ref(props.node.data?.description || '')

watch(() => props.node?.data, (data) => {
  if (data) {
    label.value = data.label || ''
    description.value = data.description || ''
  }
})

function saveChanges() {
  emit('update', props.node.id, {
    ...props.node.data,
    label: label.value,
    description: description.value,
  })
}

function deleteNode() {
  removeNodes([props.node.id])
  emit('close')
}
</script>

<template>
  <div class="h-full flex flex-col bg-white/60 backdrop-blur-sm border-l border-ink-muted/10">
    <div class="p-4 border-b border-ink-muted/10 flex items-center justify-between">
      <h3 class="font-semibold text-ink-heading text-sm">节点配置</h3>
      <button @click="emit('close')" class="text-ink-muted hover:text-ink-body transition-colors text-lg">✕</button>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- Node info -->
      <div class="flex items-center gap-3 p-3 rounded-2xl bg-surface-base">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          :style="{ background: `linear-gradient(135deg, ${node.data?.color || '#7C3AED'}15, ${node.data?.color || '#3B82F6'}10)` }"
        >
          {{ node.data?.emoji || '🤖' }}
        </div>
        <div>
          <div class="font-medium text-sm text-ink-heading">{{ node.data?.agentSlug || node.id }}</div>
          <span v-if="node.data?.departmentLabel" :class="`dept-tag dept-tag--${node.data?.department} text-[10px] px-2 py-0`">
            {{ node.data?.departmentLabel }}
          </span>
        </div>
      </div>

      <!-- Label -->
      <div>
        <label class="block text-xs font-medium text-ink-heading mb-1">显示名称</label>
        <input
          v-model="label"
          type="text"
          class="w-full px-3 py-2 rounded-xl border border-ink-muted/20 bg-white text-sm text-ink-heading focus:outline-none focus:ring-2 focus:ring-brand-violet/20"
          @blur="saveChanges"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-xs font-medium text-ink-heading mb-1">描述 / 提示词</label>
        <textarea
          v-model="description"
          rows="4"
          class="w-full px-3 py-2 rounded-xl border border-ink-muted/20 bg-white text-sm text-ink-heading focus:outline-none focus:ring-2 focus:ring-brand-violet/20 resize-none"
          placeholder="给这个节点的 AI 角色的额外指令..."
          @blur="saveChanges"
        />
      </div>
    </div>

    <!-- Delete -->
    <div class="p-4 border-t border-ink-muted/10">
      <button
        @click="deleteNode"
        class="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
      >
        🗑 删除节点
      </button>
    </div>
  </div>
</template>
