<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container demo-input-suffix">
      <el-row type="flex" class="row-bg" justify="space-around" >
         <el-col >
           合同编号:
            <el-input v-model="query.name" clearable placeholder="请输入合同号" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col >
           运输清单号:
            <el-input v-model="query.name" clearable placeholder="请输入运输清单号" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col>
            收货单位:
          <el-select v-model="query.value" filterable placeholder="请选择收货单位">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
         </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
         <el-col >
           <div class="block">
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
         <el-col >
           车牌号:
           <el-input v-model="query.name" clearable placeholder="请输入车牌号码" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col >
           合同状态:
           <el-select v-model="query.status"  clearable placeholder="请输入合同状态" class="filter-item" @keyup.enter.native="toQuery" style="width: 300px;">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" >
               </el-option>
           </el-select>
         </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col  :offset="20">
        <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">重置</el-button>
      </el-col>
    </el-row>
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
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
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
        label: '已确认'
      }, {
        value: '2',
        label: '已撤回'
      }],
      options1: [{
        value: '1',
        label: '大润发'
      }, {
        value: '2',
        label: '大润发'
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
        this.restaurants = this.loadAll();
      },
  methods: {
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

</style>
