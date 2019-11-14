import request from '@/utils/request'

export function findByAuditLog(id) {
  return request({
    url: 'api/findByAuditLog/'+id,
    method: 'get',
    id
  })
}

export function findByLnvoiceInfo(id) {
  return request({
    url: 'api/findByLnvoiceInfo/'+id,
    method: 'get',
    id
  })
}
export function operationVerify(data,newLnvoiceStatus) {
  return request({
    url: 'api/updateByOperation/'+newLnvoiceStatus,
    method: 'post',
    data,newLnvoiceStatus
  })
}
