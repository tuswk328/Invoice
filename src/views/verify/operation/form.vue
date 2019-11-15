<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="800px">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="审批信息管理">
        <el-form ref="form" :rules="rules" :model="form" size="small" label-width="660px">
          <el-divider content-position="left">审核信息</el-divider>
         <!-- <el-row>
            <el-col :span="24">
              <el-form-item label="发票号码" label-width="100px">
                <el-input v-model="form.lnvoiceNumber" />
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="受票人" label-width="100px">
                <el-input disabled v-model="form.drawwe" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="承运方" label-width="100px">
                <el-input disabled v-model="form.carrier" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="受票人税号" label-width="100px">
                <el-input disabled v-model="form.identificationNumber" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税率" label-width="100px">
                <el-input disabled v-model="form.taxRate" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="确认金额" label-width="100px">
                <el-input disabled v-model="form.contCost" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票金额" label-width="100px">
                <el-input disabled v-model="form.lnvoiceMoney" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请单状态" label-width="100px">
                <el-select disabled v-model="form.lnvoiceStatus" style="width: 200px;">
                  <el-option v-for="item in lnvoiceCommonList" :key="item.id" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人" label-width="100px">
                <el-input disabled v-model="form.creatorName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核" label-width="100px" prop="newlnvoiceStatus">
                <el-select v-model="form.newlnvoiceStatus" clearable filterable placeholder="请选择申请单状态" style="width: 200px;">
                  <el-option v-for="item in lnvoiceStatusList" :key="item.id" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核意见" label-width="100px" prop="operationComments">
                <el-input type="textarea" v-model="form.operationComments" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align: right;">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="second" label="审批日志">
        <el-divider content-position="left">审批日志</el-divider>
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column prop="nickName" label="审批人" />
          <el-table-column prop="approvalTime" label="审批时间" />
          <el-table-column prop="approvalStatus" label="审批结果">
            <template slot-scope="scope">
              <span>{{parseStatus(scope.row.approvalStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalComment" label="审批意见" />
        </el-table>
        <!--分页组件-->
        <el-pagination :total="total" :current-page="page + 1" style="margin-top: 8px;" layout="total, prev, pager, next, sizes"
          @size-change="sizeChange" @current-change="pageChange" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import initData from '@/mixins/initData'
  import store from '@/store'
  import {
    operationVerify
  } from '@/api/verify'
  import {
    parseTime,
    number_format,
    parseStatus
  } from '@/utils/index'
  import {
    lnvoiceCommonList
  } from '@/utils/common'

  export default {
    mixins: [initData],
    props: {},
    data() {
      return {
        lnvoiceStatusList: [ //申请单状态集合
          {
            value: 2,
            label: '通过'
          }, //运营已审
          {
            value: 5,
            label: '驳回'
          }, //已驳回
          {
            value: 6,
            label: '作废'
          }, //已作废
        ],
        lnvoiceCommonList: lnvoiceCommonList, //保存申请单状态集合
        lnvoiceId: '', //用于保存父组件传过来的申请单id
        activeName: 'first',
        loading: false,
        dialog: false,
        form: {},
        rules: { //表达验证
          newlnvoiceStatus: [{
            required: true,
            message: '请选择审核结果',
            trigger: 'change'
          }],
          operationComments: [{
            required: true,
            message: '请输入审核意见',
            trigger: 'blur'
          }],
        }
      }
    },
    mounted() {

    },
    methods: {
      parseStatus,
      number_format,
      parseTime,
      beforeInit() {
        this.url = 'api/findByAuditLog/' + this.lnvoiceId
        const query = this.query
        this.params = {
          page: this.page,
          size: this.size
        }
        return true
      },
      cancel() {
        this.resetForm()
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
      },
      doSubmit() {
        this.$refs['form'].validate((valid) => { //校验表单
          if (valid) {
            this.loading = true
            this.doVerify()
          } else {
            return false
          }
        })
      },
      doVerify() {
        store.dispatch('GetInfo').then(res => {
          this.form.creator = res.id
          this.form.operationUser = res.id
          console.log(this.form)
          operationVerify(this.form, this.form.newlnvoiceStatus).then(res => {
            this.$notify({
              title: '操作成功',
              type: 'success',
              duration: 2500
            })
            this.resetForm()
            this.loading = false
            this.$parent.init()
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        })
      },
    }
  }
</script>

<style scoped>

</style>
