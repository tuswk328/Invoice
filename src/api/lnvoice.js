import request from '@/utils/request'

export function findLnvoiceContract() {
  return request({
    url: 'api/findLnvoiceContract',
    method: 'get',
  })
}

export function findByContId(id) {
  return request({
    url: 'api/findByContId/'+id,
    method: 'get',
    id
  })
}
export function findLnvoiciedContract(id) {
  return request({
    url: 'api/findLnvoiciedContract/'+id,
    method: 'get',
    id
  })
}

export function findBySaveLnvoice(id) {
  return request({
    url: 'api/findBySaveLnvoice/'+id,
    method: 'get',
    id
  })
}

export function saveLnvoiceOrder(contractId,bindingContractId,lnvoiceMoney) {
  return request({
    url: 'api/saveLnvoiceOrder?contractId='+contractId+'&bindingContractId='+bindingContractId+'&lnvoiceMoney='+lnvoiceMoney,
    method: 'get',
    contractId,bindingContractId,lnvoiceMoney
  })
}
