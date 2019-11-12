import request from '@/utils/request'

export function findLnvoiceContract() {
  return request({
    url: 'api/findLnvoiceContract',
    method: 'get',
  })
}

export function findBySaveLnvoice(id) {
  return request({
    url: 'api/findBySaveLnvoice/'+id,
    method: 'get',
    id
  })
}

export function saveInvoiceOrder(contractId,bindingContractId,lnvoiceMoney) {
  return request({
    url: 'api/saveInvoiceOrder?contractId='+contractId+'&bindingContractId='+bindingContractId+'&lnvoiceMoney='+lnvoiceMoney,
    method: 'get',
    contractId,bindingContractId,lnvoiceMoney
  })
}
