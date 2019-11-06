<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" append-to-body width="1000px">
      <el-divider content-position="left">详情列表</el-divider>
     <!--表格渲染-->
     <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
       <el-table-column label="合同号" width="85" align="center"/>
       <el-table-column  prop="status" label="合同状态">
           <template slot-scope="scope">
             <span>{{scope.row.status==1?'启用':'作废'}}</span>
           </template>
       </el-table-column>
       <el-table-column  prop="engine" label="运输清单号"/>
       <el-table-column  prop="coding" label="托运单号"/>
       <el-table-column  prop="status" label="托运单状态">
           <template slot-scope="scope">
             <span>{{scope.row.status==1?'启用':'作废'}}</span>
           </template>
       </el-table-column>
       <el-table-column prop="createTime" label="运单创建日期">
         <template slot-scope="scope">
           <span>{{ parseTime(scope.row.createTime) }}</span>
         </template>
       </el-table-column>
       <el-table-column prop="createTime" label="下单时间">
         <template slot-scope="scope">
           <span>{{ parseTime(scope.row.createTime) }}</span>
         </template>
       </el-table-column>
       <el-table-column  prop="engine" label="发货单位"/>
       <el-table-column  prop="engine" label="收货单位"/>
       <el-table-column  prop="engine" label="货物名称"/>
       <el-table-column  prop="engine" label="件数"/>
       <el-table-column  prop="engine" label="起站"/>
       <el-table-column  prop="engine" label="到站"/>
       <el-table-column  prop="engine" label="车辆信息"/>
       <el-table-column  prop="engine" label="司机信息"/>
       <el-table-column prop="createTime" label="发车时间">
         <template slot-scope="scope">
           <span>{{ parseTime(scope.row.createTime) }}</span>
         </template>
       </el-table-column>
       <el-table-column prop="result" label="投保结果">
         <template slot-scope="scope">
           <span>投保结果</span>
         </template>
       </el-table-column>
       <el-table-column prop="createTime" label="失败原因"/>
       <el-table-column prop="createTime" label="确认金额"/>
       <el-table-column prop="createTime" label="投保金额"/>
     </el-table>
     <!--分页组件-->
     <el-pagination
       :total="total"
       :current-page="page + 1"
       style="margin-top: 8px;"
       layout="total, prev, pager, next, sizes"
       @size-change="sizeChange"
       @current-change="pageChange"/>
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
