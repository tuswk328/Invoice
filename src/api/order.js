import request from '@/utils/request'

export function findByOrder() {
  return request({
    url: 'api/findByOrder',
    method: 'get',
  })
}

export function findByconsigneeName() {
  return request({
    url: 'api/findByconsigneeName',
    method: 'get',
  })
}


export function download(ids) {
  return request({
    url: 'api/download?ids='+ids,
    method: 'get',
    ids
  })
}




export function getBindingContractByDrawwe() {
  return request({
    url: 'api/bindingContractByDrawwe',
    method: 'get',
  })
}



export function add(data) {
  return request({
    url: 'api/sysOrder',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/sysOrder/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/sysOrder',
    method: 'put',
    data
  })
}
