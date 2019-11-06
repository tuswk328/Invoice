<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="确认开票" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="受票人" label-width="100px">
        <el-input v-model="form.name" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item  label="受票人税号" label-width="100px">
         <el-input v-model="form.name" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="承运方" label-width="100px">
        <el-input v-model="form.name"  disabled style="width: 370px;"  />
      </el-form-item>
      <el-form-item label="合同金额" label-width="100px">
        <el-input v-model="form.name" disabled style="width: 370px;"  />
      </el-form-item>
      <el-form-item label="开票金额" label-width="100px" prop="lnvoiceMoney">
        <el-input v-model.number="form.name"  style="width: 370px;"  />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">提交申请</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      loading: false,
      dialog: false,
      depts: [],
      form: {
        id: '',
        name: '',
        pid: 1,
        enabled: 'true'
      },
      rules: {
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
          edit(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '修改成功',
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
        id: '',
        name: '',
        pid: 1,
        enabled: 'true'
      }
    },
  }
}
</script>

<style scoped>

</style>
