import request from '@/utils/request'

export function getAllBindingContract() {
  return request({
    url: 'api/bindingContract',
    method: 'get',
  })
}

export function upload(data,contractNo) {
  return request({
    url: 'api/upload/'+contractNo,
    method: 'post',
    data
  })
}

export function getBindingContractByDrawwe() {
  return request({
    url: 'api/bindingContractByDrawwe',
    method: 'get',
  })
}


export function bindingContractCancel(id) {
  return request({
    url: 'api/bindingContractCancel/'+id,
    method: 'get',
    id
  })
}

export function add(data) {
  return request({
    url: 'api/bindingContract',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/bindingContract/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/bindingContract',
    method: 'put',
    data
  })
}
