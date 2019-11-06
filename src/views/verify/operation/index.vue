<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" :dictMap="dictMap"/>
    <applicationForm ref="applicationForm"/>
    <!--工具栏-->
    <div class="head-container demo-input-suffix">
           申请单号:
            <el-input v-model="query.name" clearable placeholder="请输入申请单号" style="width: 200px;"  @keyup.enter.native="toQuery"/>
           合同号:
            <el-input v-model="query.name" clearable placeholder="请输入收货单位" style="width: 200px;"  @keyup.enter.native="toQuery"/>
           受票人:
           <el-select v-model="query.value"  filterable placeholder="请选择受票人">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
           </el-select>
           <el-button   size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
           <el-button   size="mini" type="success" icon="el-icon-search" @click="toQuery">重置</el-button>
      </el-row>
      <!-- 导出 -->
    </div>
    <div style="display: inline-block;">
      <el-button
        v-permission="['ADMIN','USER_ALL','USER_SELECT']"
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="primary"
        @click="vertify">审核</el-button>
    </div>
    <div style="display: inline-block;">
      <el-button
        v-permission="['ADMIN','USER_ALL','USER_SELECT']"
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        @click="download">导出</el-button>
    </div>
    <div style="display: inline-block;">
      <el-button
        v-permission="['ADMIN','USER_ALL','USER_SELECT']"
        size="mini"
        class="filter-item"
        type="danger"
        @click="withdrawal">确认撤回</el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" @selection-change="handleSelectionChange" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
           <el-button slot="reference" type="danger"  @click="definite(scope.row)" size="mini">申请明细</el-button>
        </template>
      </el-table-column>
      <el-table-column  prop="status" label="申清单号" width="200" align="center"/>
      <el-table-column  prop="status" label="合同号"/>
      <el-table-column prop="createTime" label="合同日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="status" label="申请单状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'启用':'作废'}}</span>
          </template>
      </el-table-column>
      <el-table-column  prop="engine" label="受票人"/>
      <el-table-column  prop="coding" label="承运方"/>
      <el-table-column  prop="status" label="开票金额" align="center" width="100">
          <template slot-scope="scope">
            <span>{{number_format(scope.row.status, 2)}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="verifyUser" label="申请人" width="100"/>
      <el-table-column prop="createTime" label="申请时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="engine" label="运营审核人" width="100"/>
      <el-table-column prop="createTime" label="运营审核时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="engine" label="财务审核人"/ width="100">
      <el-table-column prop="createTime" label="财务审核时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="engine" label="财务审核意见" width="100"/>
      <el-table-column  prop="engine" label="发票号码" width="200" align="center"/>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime,number_format,downloadFile } from '@/utils/index'
import eForm from './form'
import applicationForm from './applicationForm'

export default {
  mixins: [initData,initDict],
  components: { eForm,applicationForm },
  data() {
    return {
       vertifys:[],//保存选中的那个id
       multipleSelection: [],
       pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value2: [],
      options: [{
        value: '1',
        label: '受票人1'
      }, {
        value: '2',
        label: '受票人2'
      }],
      options1: [{
        value: '1',
        label: '承运方1'
      }, {
        value: '2',
        label: '承运方2'
      }],
      value: '',
      downloadLoading:false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
     this.getDictMap('audit_result')
  },
  mounted() {
      },
  methods: {
    // 导出
    download() {
      this.downloadLoading = true
      downloadUser().then(result => {
        downloadFile(result, '用户列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
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
          this.doUpdate()
        } else {
          return false
        }
      })
    },
    //申请明细
    definite(){
    const _this = this.$refs.applicationForm
       _this.dialog = true
    },
    //批量操作
    handleSelectionChange(val) {
    var isCheckbox=[] //保存已勾选的集合
        this.multipleSelection = val;
        for (var i = 0; i < this.multipleSelection.length; i++) {
          isCheckbox.push(this.multipleSelection[i])
        }
        this.vertifys = isCheckbox
    },
    //点击审核
    vertify(){
      if(this.vertifys==''){
          this.$notify({
            title: '请选择要操作的数据',
            type: 'error',
            duration: 2500
          })
      }
      else if(this.vertifys.length>1){
          this.$notify({
            title: '请选择一条数据',
            type: 'error',
            duration: 2500
          })
      }
      else{
         const _this = this.$refs.form
         _this.form = {
           id: this.vertifys[0].id,
           name: this.vertifys[0].name,
           deptNo: this.vertifys[0].deptNo,
           pid: this.vertifys[0].pid,
           createTime: this.vertifys[0].createTime,
           auditResult:{
             id:this.vertifys[0].pid,
           }
         }
         _this.dialog = true
      }
    },
    //确认撤回
    withdrawal(){
        if(this.vertifys==''){
            this.$notify({
              title: '请选择要操作的数据',
              type: 'error',
              duration: 2500
            })
        }
        else if(this.vertifys.length>1){
            this.$notify({
              title: '请选择一条数据',
              type: 'error',
              duration: 2500
            })
        }
        else{
           this.$confirm('确认撤回, 是否继续?', '提示', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //撤回通过
                this.$message({
                  type: 'success',
                  message: '撤回成功!'
                });
              
            }).catch(action  => {


            });
        }
    }
  }
}
</script>

<style scoped>

</style>
