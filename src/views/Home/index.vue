<template>
  <div>
    <VanButton
      @click="goChat()"
      class="wp-100 mt-32"
      type="primary"
      plain
      size="small"
    >
      去聊天室
    </VanButton>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  function goChat() {
    router.push('/chat')
  }
</script>
