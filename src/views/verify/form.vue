<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="700px">
   <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane name="first" label="审批信息管理">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="660px">
        <el-divider content-position="left">审核信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号码" label-width="100px" prop="projectName">
                 <el-input v-model="form.projectName" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受票人" label-width="100px" >
                <el-input v-model="form.supplierName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="承运方" label-width="100px" prop="projectName">
                 <el-input v-model="form.projectName" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受票人税号" label-width="100px" >
                <el-input v-model="form.supplierName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请人" label-width="100px" prop="projectName">
                 <el-input v-model="form.projectName" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认金额" label-width="100px" >
                <el-input v-model="form.supplierName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票金额" label-width="100px" prop="projectName">
                 <el-input v-model="form.projectName" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请状态" label-width="100px" >
                <el-input v-model="form.supplierName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核" label-width="100px" prop="projectName">
                 <el-input v-model="form.projectName" style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核意见" label-width="100px" >
                <el-input v-model="form.supplierName" style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="second" label="审批日志">
      <el-divider content-position="left">审批日志</el-divider>
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column label="操作" width="225" align="center">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="verifyInfo(scope.row)">审核详情</el-button>
             <el-button slot="reference" type="danger"  @click="definite(scope.row)" size="mini">申请明细</el-button>
          </template>
        </el-table-column>
        <el-table-column  prop="status" label="申清单号"/>
        <el-table-column  prop="status" label="合同号"/>
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
export default {
  props: {
  },
  data() {
    return {
      activeName:'first',
      loading: false,
      dialog: false,
      form: {
        id: '',
        name: '',
        pid: 1,
        enabled: 'true'
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
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
          if (this.form.pid !== undefined) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            this.$message({
              message: '上级部门不能为空',
              type: 'warning'
            })
          }
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
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
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    }
  }
}
</script>

<style scoped>

</style>
