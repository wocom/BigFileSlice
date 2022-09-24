<script setup lang="ts">
import api from '@/request/api';
import { ref, onMounted } from 'vue';

const loading = ref(false)

const precent = ref(0)

const tip = ref('拼命上传中...')


// ---------------------------------------------上传
const fileChange = async (e: any) => {
  precent.value = 0
  loading.value = true
  const files = e.target.files
  // 文件对象
  const file = files[0]
  if (!file) {
    console.warn('未获取到文件')
    loading.value = false
    return
  }
  // console.log(file)

  // 文件大小
  const fileSize = file.size
  // 文件名
  const fileName = file.name

  // 切片大小 100M
  const chunckSize = 1024 * 1024 * 100

  // 切片总数
  const total = fileSize % chunckSize === 0 ? fileSize / chunckSize : Math.ceil(fileSize / chunckSize)

  // 切片计数
  let index = 0

  // 切片开始位置
  let start = 0

  // 循环切片
  while (start < fileSize) {
    let blob = null
    blob = file.slice(start, Math.min(start + chunckSize, fileSize))
    start += chunckSize
    const blobFile = new File([blob], fileName)
    const formData = new FormData()
    formData.append('index', index + '')
    formData.append('file', blobFile)
    const chunk = await api.upload(formData)
    index++
    precent.value = start >= fileSize ? 100 : Number(Number((start / fileSize) * 100).toFixed(2))
  }
  tip.value = '上传完毕，数据合并中'
  const mergeData = {
    total,
    name: fileName
  }
  const merge = await api.merge(mergeData)

  tip.value = '合并完成'
  setTimeout(() => {
    loading.value = false
    precent.value = 0
    search()
  }, 500)
}

// 列表数据
const dataList = ref([])
// 列
const columns = [
  {
    title: '文件名',
    key: 'name',
    // dataIndex: 'name'
  },
  {
    title: '大小',
    key: 'size',
    // dataIndex: 'name'
  },
  {
    title: '下载',
    key: 'download',
    // dataIndex: 'action'
  },
  {
    title: '删除',
    key: 'delete',
    // dataIndex: 'action'
  }
]

// ---------------------------------------------查询上传文件列表
const search = async () => {
  loading.value = true
  tip.value = '数据加载中...'
  const res = await api.getList()
  dataList.value = res.data.data ? res.data.data : []

  tip.value = '加载成功'
  setTimeout(() => {
    loading.value = false
  }, 500)
}
onMounted(() => {
  search()
})

// ---------------------------------------------下载
const downLoad = async (row: any) => {
  loading.value = true
  tip.value = '下载中...'

  const params = {
    name: row.name
  }
  const res = await api.download(params)
  const blob = new Blob([res.data], { type: 'charset=utf-8' })
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = (e: any) => {
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = e.target.result
    a.download = row.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    tip.value = '下载成功'
    setTimeout(() => {
      loading.value = false
    }, 500);
  }
}

// ---------------------------------------------删除
const deleteFile = async (row: any) => {
  loading.value = true
  tip.value = '删除中...'

  const params = {
    name: row.name
  }
  const res = await api.deleteFile(params)
  console.log(res)

  tip.value = '删除成功'
  search()
  setTimeout(() => {
    loading.value = false
  }, 500);
}

</script>

<template>
  <div class="box">
    <div class="list">
      <a-button type="primary" @click="search">搜索</a-button>
      <a-table :data-source="dataList" :columns="columns" :pagination="false" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span>{{ record.name }}</span>
          </template>
          <template v-else-if="column.key === 'size'">
            <span>{{ record.size }}</span>
          </template>
          <template v-else-if="column.key === 'download'">
            <a-button @click="downLoad(record)">下载</a-button>
          </template>
          <template v-else-if="column.key === 'delete'">
            <a-button @click="deleteFile(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <div class="up">
      <div class="upload-area">
        <input type="file" name="upload" id="upload" @change="fileChange" />
        <div class="text">
          <span class="iconfont icon-shangchuanneirong"></span>
        </div>
      </div>
      <!-- <input type="button" name="start" value="开始" /> -->
      <!-- <input type="button" name="pause" value="暂停" /> -->
    </div>
    <!-- <div class="pro" style="width: 300px;">
      <a-progress :percent="precent" :status="loading?'active':'normal'" />
    </div> -->
  </div>
  <div class="mb" :style="{display: loading?'block':'none'}">
    <a-spin :spinning="loading" size="large" :tip="tip" />
  </div>
</template>

<style lang="less" scoped>
@import './style/index.less';
@import '@/assets/iconfont/iconfont.css';
</style>
