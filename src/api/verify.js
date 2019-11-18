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
export function financialVerify(data,newLnvoiceStatus) {
  return request({
    url: 'api/updateByFinancial/'+newLnvoiceStatus,
    method: 'post',
    data,newLnvoiceStatus
  })
}

export function financialByLnvoice(data) {
  return request({
    url: 'api/updateByFinancialByLnvoice',
    method: 'post',
    data
  })
}

export function financialByRevoke(data) {
  return request({
    url: 'api/updateByFinancialByRevoke',
    method: 'post',
    data
  })
}

export function updateByWithdrawal(data) {
  return request({
    url: 'api/updateByWithdrawal',
    method: 'post',
    data
  })
}


