<template>
  <div class="wp-100 relative">
    <video ref="video"></video>
  </div>
</template>

<script lang="ts" setup>
  import { Toast } from 'vant'
  import { onMounted, ref } from 'vue'

  onMounted(() => {
    init()
  })

  function init() {
    getUserMedia()
  }

  const video = ref()
  async function getUserMedia() {
    try {
      if (!navigator.mediaDevices.getUserMedia)
        return Toast('当前设备不支持getuserMedia')
      const constrains = {
        audio: false,
        video: true,
      }
      const res = await navigator.mediaDevices.getUserMedia(constrains)
      console.log(video.value)
      video.value.srcObject = res
      video.value.onloadedmetadata = () => {
        video.value.play()
      }
    } catch (e: any) {
      //TODO handle the exception

      console.log('访问用户媒体设备失败：', e.name, e.message)
    }
  }
</script>
