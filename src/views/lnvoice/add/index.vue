<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" />
    <!--工具栏-->
    <div class="head-container">
      <el-row>
         <el-col  :span="6">
           受票人:
           <el-select v-model="query.value"  filterable placeholder="请选择受票人">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
           </el-select>
         </el-col>
         <el-col class="row-bg" justify="space-around" :span="6">
           承运方:
           <el-select v-model="query.status"  clearable placeholder="请输入承运方" @keyup.enter.native="toQuery" style="width: 200px;">
               <el-option
                 v-for="item in options1"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" >
               </el-option>
           </el-select>
         </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
         <el-col :span="6">
           合同号:
            <el-input v-model="query.name" clearable placeholder="请输入收货单位" style="width: 200px;"  @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col :span="10">
           <div class="block" >
             合同时间:
             <el-date-picker
               v-model="query.name"
               type="daterange"
               align="right"
               unlink-panels
               range-separator="——"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
               :picker-options="pickerOptions" style="width: 300px;" >
             </el-date-picker>
          </div>
         </el-col>
         <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
         <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">重置</el-button>
      </el-row>
      <!-- 审核 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_VERTIFY']"
          class="filter-item"
          :loading="vertifyLoading"
          size="mini"
          type="danger"
          icon="el-icon-s-check"
          @click="vertify">确定开票</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table @selection-change="handleSelectionChange" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column label="合同号"   prop="customerNo" width="85" align="center"/>
      <el-table-column  prop="status" label="合同状态">
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'启用':'作废'}}</span>
          </template>
      </el-table-column>
      <el-table-column  prop="engine" label="合同日期">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
       </el-table-column>
      <el-table-column  prop="status" label="合同状态">
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'启用':'作废'}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="受票人"/>
      <el-table-column prop="createTime" label="合同金额"/>
      <el-table-column  prop="engine" label="总件数"/>
      <el-table-column  prop="engine" label="所属合同"/>
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
import eForm from './form'
import { parseTime } from '@/utils/index'
export default {
  components: { eForm },
  mixins: [initData],
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
      value: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted() {
      },
  methods: {
    parseTime,
    beforeInit() {
      this.url = 'api/dict'
      const query = this.query
      const name = query.name
      this.params = { page: this.page, size: this.size }
      if (name) { this.params['name'] = name }
      return true
    },
    cancel() {
      this.resetForm()
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
     //确认开票
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
          }
          _this.dialog = true
       }
     },

  }
}
</script>

<style scoped>

</style>
