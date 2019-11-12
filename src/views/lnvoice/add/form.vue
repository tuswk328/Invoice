<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="确认开票" width="600px">
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
      <el-form-item  label="受票人税号" label-width="100px">
         <el-input v-model="form.identificationNumber" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同金额" label-width="100px">
        <el-input v-model="form.contCost" disabled style="width: 370px;"  />
      </el-form-item>
      <el-form-item label="开票金额" label-width="100px" prop="lnvoiceMoney">
        <el-input v-model.number="form.lnvoiceMoney"  style="width: 370px;"  />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">提交申请</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {saveInvoiceOrder} from '@/api/lnvoice'
export default {
  props: {
  },
  data() {
    return {
      loading: false,
      dialog: false,
      depts: [],
      carrierList:[],//查询承运方集合
      form: {
        contractId:'',//保存成协的合同id
        bindingContractId:'',//绑定的合同id
        drawwe: '',
        carrier:'',
        identificationNumber:'',
        contCost: '',
        lnvoiceMoney: ''
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
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveInvoiceOrder(this.form.contractId,this.form.bindingContractId,this.form.lnvoiceMoney).then(res => {
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
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        lnvoiceMoney:'',
      }
    },
    //根据承运方查询受票人税号
    findbyCarrier(item){
      this.form.identificationNumber = item.identificationNumber
      this.form.bindingContractId = item.id
    }
  }
}
</script>

<style scoped>

</style>
