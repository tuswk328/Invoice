<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="1000px">
    <el-divider content-position="left">详情列表</el-divider>
    <order ref="order" :data="data" :loading="loading"></order>
    <el-pagination :total="total" :current-page="page + 1" style="margin-top: 8px;" layout="total, prev, pager, next, sizes"
      @size-change="sizeChange" @current-change="pageChange" />
  </el-dialog>
</template>

<script>
  import initData from '@/mixins/initData'
  import {
    parseTime
  } from '@/utils/index'
  import order from '@/views/components/orderList'

  export default {
    mixins: [initData],
    components: {
      order
    },
    props: {},
    data() {
      return {
        contractId: '',
        dialog: false
      }
    },
    created() {
      this.$nextTick(() => {})
    },
    methods: {
      cancel() {
        this.dialog = false
      },
      beforeInit() {
        this.url = 'api/findByContractOrder/' + this.contractId
        const query = this.query
        this.params = {
          page: this.page,
          size: this.size
        }
        return true
      },
    }
  }
</script>

<style scoped>

</style>
