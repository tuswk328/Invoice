<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="确认开票" width="800px">
   <el-tabs v-model="activeName">
    <el-tab-pane name="first" label="新增开票">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="受票人" label-width="100px">
        <el-input v-model="form.drawwe" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="承运方" label-width="100px" prop="carrier">
       <el-select  value-key="id"   @change="findbyCarrier" v-model="form.carrier"   placeholder="请输入承运方">
           <el-option
             v-for="item in carrierList"
             :key="item.id"
             :label="item.carrierName"
             :value="item" >
           </el-option>
       </el-select>
      </el-form-item>
        <el-form-item
          v-for="(item, index) in lnvoiceMoney"
          :label="item.label"
           label-width="100px"
           style="width: 270px;"
          :key="item.id"
          :rules="{
            required: true, message: '请输入发票金额', trigger: 'blur'
          }"
        >
        <el-input v-model="item.value"></el-input><el-button @click.prevent="removeDomain(item)">删除</el-button>
        </el-form-item>
      <!--
      <el-form-item  label="受票人税号" label-width="100px">
         <el-input v-model="form.identificationNumber" disabled style="width: 370px;"/>
      </el-form-item> -->
      <el-form-item label="合同金额" label-width="100px">
        <el-input v-model="form.contCost" disabled style="width: 370px;"  />
      </el-form-item>
      <el-form-item  v-if="lnvoicedMoney!=0" label="已开票金额" label-width="100px" >
        <el-input v-model.number="lnvoicedMoney" disabled style="width: 370px;"  />
      </el-form-item>
      <div style="text-align: right;">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">提交申请</el-button>
      </div>
    </el-form>
    </el-tab-pane>
    <el-tab-pane name="second" label="开票历史">
      <el-divider content-position="left">审批日志</el-divider>
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column prop="lnvoiceOrder" label="申请单号" />
        <el-table-column prop="carrier" label="承运方" />
        <el-table-column prop="lnvoiceStatus" label="申请单结果">
          <template slot-scope="scope">
            <span>{{parseStatus(scope.row.lnvoiceStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lnvoiceMoney" label="开票金额">
          <template slot-scope="scope">
            <span>{{number_format(scope.row.lnvoiceMoney)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" />
      </el-table>
      <!--分页组件-->
      <el-pagination :total="total" :current-page="page + 1" style="margin-top: 8px;" layout="total, prev, pager, next, sizes"
        @size-change="sizeChange" @current-change="pageChange" />
    </el-tab-pane>
   </el-tabs>
  </el-dialog>
</template>

<script>
  import {
    parseTime,
    number_format,
    parseStatus
  } from '@/utils/index'
  import initData from '@/mixins/initData'
  import {saveLnvoiceOrder} from '@/api/lnvoice'
export default {
  mixins: [initData],
  props: {
  },
  data() {
    return {
	    lnvoicedMoney:'',//已开票金额
      activeName: 'first',
      loading: false,
      dialog: false,
      depts: [],
      carrierList:[],//查询承运方集合
      contractId:[],//保存成协的合同id
      lnvoiceMoney:[
      ],
      form: {
        bindingContractId:'',//绑定的合同id
        drawwe: '',
        carrier:'',
        identificationNumber:'',
        contCost: '',
        deptId:''
      },
      rules: {
        carrier: [
          { required: true, message: '请选择承运方', trigger: 'change' }
        ],
        lnvoiceMoney: [
            { required: true, message: '金额不能为空',trigger: 'blur'},
            {  type: 'number', message: '请输入数字',trigger: 'blur' } ,
        ]
      }
    }
  },
  methods: {
    parseStatus,
    number_format,
    parseTime,
    beforeInit() {
      this.url = 'api/findByContId/' + this.contractId
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
    //开票申请新增
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          var lnvoiceMoney=[]
          var bindingContractId=[]
          if(this.lnvoiceMoney.length>0){
            for (var i = 0; i < this.lnvoiceMoney.length; i++) {
              if(this.lnvoiceMoney[i].value!=''){
                lnvoiceMoney.push(this.lnvoiceMoney[i].value)
                bindingContractId.push(this.lnvoiceMoney[i].id)
              }
              else{
                this.$notify({
                  title: '请输入开票金额',
                  type: 'success',
                  duration: 2500
                })
                return
              }
            }
            saveLnvoiceOrder(this.contractId,bindingContractId,lnvoiceMoney).then(res => {
              this.resetForm()
              this.$notify({
                title: '开票成功',
                type: 'success',
                duration: 2500
              })
              this.loading = false
              this.$parent.init()
            }).catch(err => {
              this.loading = false
              console.log(err.response.data.message)
            })
          }else{
            this.$notify({
              title: '请选择承运方',
              type: 'success',
              duration: 2500
            })
          }
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.lnvoiceMoney=[]

    },
    //根据承运方查询受票人税号
    findbyCarrier(item){
      this.form.identificationNumber = item.identificationNumber
      if(this.lnvoiceMoney.length>0){
        for (var i = 0; i < this.lnvoiceMoney.length; i++) {
          if(this.lnvoiceMoney[i].label==item.carrierName){
            return
          }
        }
      }
      this.lnvoiceMoney.push({
        id:item.id,
        value:this.form.lnvoiceMoney,
        label:item.carrierName
      });
    },
    removeDomain(item) {
            var index = this.lnvoiceMoney.indexOf(item)
            if (index !== -1) {
              this.lnvoiceMoney.splice(index, 1)
            }
          },
  }
}
</script>

<style scoped>

</style>
