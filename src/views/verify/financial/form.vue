<template>
  <el-dialog  :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="800px">
   <el-tabs v-model="activeName" >
    <el-tab-pane name="first" label="审批信息管理">
      <el-form ref="form"  :model="form" :rules="rules" size="small" label-width="660px">
        <el-divider content-position="left">审核信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号码" label-width="100px">
                 <el-input v-model="form.projectName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受票人" label-width="100px" >
                <el-input v-model="form.supplierName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="承运方" label-width="100px" >
                 <el-input v-model="form.projectName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受票人税号" label-width="100px" >
                <el-input v-model="form.supplierName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请人" label-width="100px" >
                 <el-input v-model="form.projectName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认金额" label-width="100px" >
                <el-input v-model="form.supplierName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开票金额" label-width="100px" >
                 <el-input v-model="form.projectName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请状态" label-width="100px" >
                <el-input v-model="form.supplierName" disabled style="width: 150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核" label-width="100px" prop="auditResult.id">
                 <el-select  v-model="form.auditResult.id" style="width: 150px;" placeholder="请选择类型">
                   <el-option  v-for="(item, index) in dictMap.audit_result"
                     :key="item.index"
                     :label="item.label"
                     :value="item.id"
                     />
                 </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核意见" label-width="100px" prop="opinion">
                <el-input  type="textarea" rows="5" v-model="form.opinion"  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="float: right;">
            <el-col :span="24" >
              <el-button type="text" @click="cancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
            </el-col>
          </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="second" label="审批日志">
      <el-divider content-position="left">审批日志</el-divider>
      <el-table  v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column label="审批人" width="100" align="center" />
        <el-table-column  prop="status" label="审批时间"  width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
          </el-table-column>
        <el-table-column  prop="status" width="100" label="审批结果"/>
        <el-table-column  prop="status" width="100" label="审批意见"/>
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
import { parseTime,number_format } from '@/utils/index'
export default {
  mixins: [initData],
  props: {
    dictMap: {
      type: Object,
      required: true
    },
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
        enabled: 'true',
        opinion:'',
        auditResult:{
          id:''
        }
      },
      rules: {
        opinion: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ],
        auditResult:
        {
         id: [
            { required: true, message: '请选择审核结果', trigger: 'change' }
          ],
        },
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    number_format,
    parseTime,
    beforeInit() {
      this.url = 'api/users'
      const query = this.query
      const name = query.name
      this.params = { page: this.page, size: this.size }
      if (name) { this.params['name'] = name }
      return true
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
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
      /* this.form = {
        id: '',
        name: '',
        pid: 1,
        enabled: 'true'
      } */
    },
  }
}
</script>

<style scoped>

</style>
