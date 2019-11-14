<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="800px">
   <el-tabs v-model="activeName">
    <el-tab-pane name="first" label="审批信息管理">
      <el-form ref="form"  :model="form"  size="small" label-width="660px">
        <el-divider content-position="left">审核信息</el-divider>
          <el-row>
            <el-col :span="24">
              <el-form-item label="发票号码" label-width="100px" >
                 <el-input disabled v-model="form.invoiceNumber"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="受票人" label-width="100px" >
                <el-input disabled v-model="form.drawwe"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="承运方" label-width="100px" >
                 <el-input disabled v-model="form.carrier"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="受票人税号" label-width="100px" >
                <el-input disabled v-model="form.identificationNumber" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税率" label-width="100px" >
                <el-input disabled v-model="form.taxRate" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="确认金额" label-width="100px" >
                <el-input disabled v-model="form.contCost" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票金额" label-width="100px" >
                 <el-input disabled v-model="form.lnvoiceMoney" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请单状态" label-width="100px" >
                <el-input disabled v-model="form.lnvoiceStatus" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人" label-width="100px" >
                 <el-input disabled v-model="form.creatorName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="second" label="审批日志">
      <el-divider content-position="left">审批日志</el-divider>
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column  prop="nickName" label="审批人"/>
        <el-table-column  prop="approvalTime" label="审批时间"/>
        <el-table-column  prop="approvalStatus" label="审批结果">
            <template slot-scope="scope">
              <span>{{parseStatus(scope.row.approvalStatus)}}</span>
            </template>
        </el-table-column>
        <el-table-column  prop="approvalComment" label="审批意见"/>
      </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          :current-page="page + 1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
    </el-tab-pane>
   </el-tabs>
  </el-dialog>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime,number_format,parseStatus } from '@/utils/index'
export default {
  mixins: [initData],
  props: {
  },
  data() {
    return {
      lnvoiceId:'',//用于保存父组件传过来的申请单id
      activeName:'first',
      loading: false,
      dialog: false,
      form: {
      },
    }
  },
  mounted() {

  },
  methods: {
    parseStatus,
    number_format,
    parseTime,
    beforeInit() {
      this.url = 'api/findByAuditLog/'+this.lnvoiceId
      const query = this.query
      this.params = { page: this.page, size: this.size }
      return true
    },
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
    },
  }
}
</script>

<style scoped>

</style>
