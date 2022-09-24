import instance from './index'

// 切片上传
function upload(mod: any){
  return instance.post('/bfs/upload', mod, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 合并切片
function merge(mod: any){
  return instance.post('/bfs/merge_chunks', mod)
}

// 上传文件列表
function getList(){
  return instance.get('/bfs/list')
}

// 下载文件
function download(params: any){
  return instance.get('/bfs/download', { 
    params,
    responseType: 'arraybuffer'
  })
}

// 删除文件
function deleteFile(params: any){
  return instance.delete('/bfs/delete', { params })
}

export default {
  upload,
  merge,
  getList,
  download,
  deleteFile
}