<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="800px">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="审批信息管理">
        <el-form ref="form" :rules="rules" :model="form" size="small" label-width="660px">
          <el-divider content-position="left">审核信息</el-divider>

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
              <el-form-item label="受票人税号" label-width="100px" >
                <el-input disabled v-model="form.identificationNumber" style="width: 280px;"/>
              </el-form-item>
            </el-col>
            <el-col  v-if="isverify" :span="12">
              <el-form-item label="税率" label-width="100px" prop="taxRate" >
                <el-input  v-model.number="form.taxRate"  style="width: 280px;"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="确认金额" label-width="100px">
                <el-input disabled v-model="contCost" style="width: 280px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票金额" label-width="100px">
                <el-input disabled v-model="lnvoiceMoney" style="width: 280px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请单状态" label-width="100px">
                <el-select disabled v-model="form.lnvoiceStatus" style="width: 280px;">
                  <el-option v-for="item in lnvoiceCommonList" :key="item.id" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请人" label-width="100px">
                <el-input disabled v-model="form.creatorName" style="width: 280px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isverify">
            <el-col :span="24">
              <el-form-item label="发票号码" label-width="100px" prop="lnvoiceNumber">
                <el-input v-model="form.lnvoiceNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!isverify">
            <el-col :span="12">
              <el-form-item label="审核" label-width="100px" prop="newlnvoiceStatus">
                <el-select v-model="form.newlnvoiceStatus" clearable filterable placeholder="请选择申请单状态"
                @change="selectOne" value-key="value" style="width: 200px;">
                  <el-option v-for="item in lnvoiceStatusList" :key="item.id" :label="item.label" :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!isverify">
            <el-col :span="24">
              <el-form-item label="审核意见" label-width="100px" prop="financialComments">
                <el-input type="textarea" v-model="form.financialComments" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align: right;">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="subLoading" type="primary" @click="doSubmit">确认</el-button>
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
    financialVerify,financialByLnvoice
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
    props: {
      isverify: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        contCost:'',//用于显示合同金额
        lnvoiceMoney:'',//用于显示开票金额
        lnvoiceStatusList: [ //申请单状态集合
          {
            value: 3,
            label: '通过'
          }, //财务已审
          {
            value: 7,
            label: '驳回'
          }, //驳回开票
          {
            value: 8,
            label: '作废'
          }, //作废开票
        ],
        lnvoiceCommonList: lnvoiceCommonList, //保存申请单状态集合
        lnvoiceId: '', //用于保存父组件传过来的申请单id
        activeName: 'first',
        loading: false,
        subLoading:false,
        dialog: false,
        form: {},
        rules: { //表达验证
          newlnvoiceStatus: [{
            required: true,
            message: '请选择审核结果',
            trigger: 'change'
          }],
          financialComments: [{
            required: true,
            message: '请输入审核意见',
            trigger: 'blur'
          }],
          taxRate: [{
            required: true,
            message: '请输入税率',
            trigger: 'blur'
          },
      { type: 'number', message: '税率必须为数字值', trigger: 'blur'}
    ],
          lnvoiceNumber: [{
            required: true,
            message: '请输入发票号码',
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
      selectOne(item) {     //change 触发事件
         this.form.financialComments = item.label
        },
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
      },
      doSubmit() {
        this.$refs['form'].validate((valid) => { //校验表单
          if (valid) {
            this.subLoading = true
              this.doVerify()
          } else {
            return false
          }
        })
      },
      doVerify() {
        store.dispatch('GetInfo').then(res => {
          this.form.creator = res.id
          this.form.financialUser = res.id
          //审核
          if(!this.isverify){
             if(this.form.lnvoiceStatus==2){
               financialVerify(this.form, this.form.newlnvoiceStatus.value).then(res => {
                 this.$notify({
                   title: '操作成功',
                   type: 'success',
                   duration: 2500
                 })
                 this.resetForm()
                 this.subLoading = false
                 this.$parent.init()
               }).catch(err => {
                 this.subLoading = false
                 console.log(err.response.data.message)
               })
             }
             else{
               this.subLoading = false
               this.$notify({
                 title: '状态不符,请勿重复操作',
                 type: 'error',
                 duration: 2500
               })
             }
          }
          //开票
          else{
            if(this.form.lnvoiceStatus==3){
              financialByLnvoice(this.form).then(res => {
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 2500
                })
                this.resetForm()
                this.subLoading = false
                this.$parent.init()
              }).catch(err => {
                this.subLoading = false
                console.log(err.response)
              })
            }
            else{
              this.subLoading = false
              this.$notify({
                title: '状态不符,请勿重复操作',
                type: 'error',
                duration: 2500
              })
            }
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
