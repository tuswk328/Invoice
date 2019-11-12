<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container demo-input-suffix">
      <el-row>
         <el-col :span="6" class="filter-item">
            <span class="label">申请单号:</span>
            <el-input v-model="query.name" clearable placeholder="请输入合同号" style="width: 200px;"  @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col :span="6" class="filter-item">
            <span class="label">合同号:</span>
            <el-input v-model="query.name" clearable placeholder="请输入收货单位" style="width: 200px;"  @keyup.enter.native="toQuery"/>
         </el-col>
          <el-col :span="6" class="filter-item">
            <span class="label">受票人:</span>
           <el-select v-model="query.value"  filterable placeholder="请选择受票人">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
           </el-select>
         </el-col>
      </el-row>
      <el-row>
       
          <!-- <el-col :span="6" class="filter-item">
           <div class="block" >
              <span class="label"> 合同时间:</span>
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
         </el-col> -->
          <el-col :span="6"  class="filter-item">
                <span class="label">开始时间:</span>
                <el-date-picker clearable style="width: 200px;" v-model="query.startDate"  type="date" placeholder="选择开始日期"></el-date-picker>
              </el-col>
              <el-col :span="6"  class="filter-item">
                <span class="label">结束时间:</span>
                <el-date-picker style="width: 200px;" clearable v-model="query.endDate"  type="date" placeholder="选择截止日期" ></el-date-picker>
              </el-col>
         <el-col :span="6"  class="filter-item">
            <span class="label">承运方:</span>
           <el-select v-model="query.status"  clearable placeholder="请输入承运方" @keyup.enter.native="toQuery" style="width: 200px;">
               <el-option
                 v-for="item in options1"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" >
               </el-option>
           </el-select>
         </el-col>
         <el-col  :offset="20">
           <el-button   class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
           <el-button   class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">重置</el-button>
         </el-col>
      </el-row>
    </div>
    <!-- 导出 -->
    <div style="display: inline-block;">
      <el-button
        v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EXPORT']"
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="download">导出</el-button>
    </div>
    <el-row :gutter="20">
    </el-row>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column label="申请单号" prop="status" width="85" align="center"/>
      <el-table-column  prop="status" label="合同号"/>
      <el-table-column prop="createTime" label="合同日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="status" label="申请单状态">
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'启用':'作废'}}</span>
          </template>
      </el-table-column>
      <el-table-column  prop="engine" label="受票人"/>
      <el-table-column  prop="coding" label="承运方"/>
      <el-table-column  prop="status" label="开票金额">
          <template slot-scope="scope">
            <span>{{number_format(scope.row.status, 2)}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请人"/>
      <el-table-column prop="createTime" label="申请时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="engine" label="运营审核人"/>
      <el-table-column prop="createTime" label="运营审核时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="engine" label="财务审核人"/>
      <el-table-column prop="createTime" label="财务审核时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="engine" label="财务审核意见"/>
      <el-table-column  prop="engine" label="发票号码"/>
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
import { parseTime,number_format } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
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
    number_format,
    parseTime,
    beforeInit() {
      this.url = 'api/generator/tables'
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
  }
}
</script>

<style scoped>
.label{
  display: inline-block;
  width: 80px;
  text-align: right;
}
</style>
