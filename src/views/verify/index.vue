<template>
  <div class="app-container">
    <!--form 组件-->
    <!-- <eForm ref="form"/> -->
    <applicationForm ref="applicationForm"/>
    <!--工具栏-->
    <div class="head-container demo-input-suffix">
	   <el-row>
		 <el-col :span="6" class="filter-item">
		   <span class="label">申请单号:</span>
		   <el-input v-model="query.lnvoiceOrder" clearable placeholder="请输入申请单号" style="width: 200px;"
			 @keyup.enter.native="toQuery" />
		 </el-col>
		 <el-col :span="6" class="filter-item">
		   <span class="label">申请单状态:</span>
       <el-select v-model="query.lnvoiceStatus" clearable filterable placeholder="请选择申请单状态" style="width: 200px;"
        @keyup.enter.native="toQuery">
       <el-option v-for="item in lnvoiceStatusList" :key="item.id" :label="item.label" :value="item.value">
       </el-option>
       </el-select>
		 </el-col>
		 <el-col :span="6" class="filter-item">
		   <span class="label">受票人:</span>
		   <el-select v-model="query.drawwe" clearable filterable placeholder="请选择受票人" style="width: 200px;"
        @keyup.enter.native="toQuery">
			 <el-option v-for="item in drawweList" :key="item.id" :label="item.drawwe" :value="item.drawwe">
			 </el-option>
		   </el-select>
		 </el-col>
      </el-row>
      <el-col :offset="20">
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-col>
      <!-- 导出 -->
    </div>
    <div style="display: inline-block;">
      <el-button
        v-permission="['ADMIN','USER_ALL','USER_SELECT']"
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="download">导出</el-button>
    </div>
    <!--表格渲染-->
    <el-table @selection-change="handleSelectionChange" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection" />
       <el-table-column label="操作" width="200" align="center" >
       <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="verifyInfo(scope.row)">审核详情</el-button>
          <el-button slot="reference" type="danger"  @click="definite(scope.row)" size="mini">申请明细</el-button>
       </template>
      </el-table-column>
      <el-table-column label="申请单号" prop="lnvoiceOrder" width="85" align="center" />
      <el-table-column prop="contNo" label="合同号" />
      <el-table-column prop="contDate" label="合同日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="申请单状态">
        <template slot-scope="scope">
          <span>{{parseStatus(scope.row.lnvoiceStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="drawwe" label="受票人" />
      <el-table-column prop="carrier" label="承运方" />
      <el-table-column prop="lnvoiceMoney" label="开票金额">
        <template slot-scope="scope">
          <span>{{number_format(scope.row.lnvoiceMoney, 2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="申请人" />
      <el-table-column prop="creatDate" label="申请时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creatDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operationName" label="运营审核人" />
      <el-table-column prop="operationDate" label="运营审核时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operationDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operationComments" label="运营审核意见" />
      <el-table-column prop="financialName" label="财务审核人" />
      <el-table-column prop="financialDate" label="财务审核时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.financialDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="financialComments" label="财务审核意见" />
      <el-table-column prop="invoiceNumber" label="发票号码" width="100" />
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
import { parseTime,number_format,parseStatus } from '@/utils/index'
import eForm from './form'
import applicationForm from './applicationForm'
import {getBindingContractByDrawwe} from '@/api/bindingContract.js'


export default {
  mixins: [initData],
  components: { eForm,applicationForm },
  data() {
    return {
      lnvoiceStatusList:[ //申请单状态集合
        {value:1,label:'已申请'},
        {value:2,label:'运营已审'},
        {value:3,label:'财务已审'},
        {value:4,label:'已开票'},
        {value:5,label:'已驳回'},
        {value:6,label:'已作废'},
        {value:7,label:'驳回开票'},
        {value:8,label:'作废开票'},
        {value:9,label:'待撤回'},
        {value:10,label:'已撤回'},
      ],
      downloadLoading:false,
      drawweList: [], //受票人集合
      lvnoiceOrderList: [], //保存开票订单集合
      multipleSelection: []
    }
  },
  created() {
   this.$nextTick(() => {
     this.init()
     this.getBindingContractByDrawwe() //查询受票人
   })
  },
  mounted() {
      },
  methods: {
    parseStatus,
    number_format,
    parseTime,
    reset() {
      this.$set(this.query, 'lnvoiceOrder', '')
      this.$set(this.query, 'drawwe', '')
      this.$set(this.query, 'lnvoiceStatus', null)
      this.init()
    },
    beforeInit() {
      this.url = 'api/findByLnvoiceOrder'
      const query = this.query
      const lnvoiceOrder = query.lnvoiceOrder
      const lnvoiceStatus = query.lnvoiceStatus
      const drawwe = query.drawwe
      this.params = { page: this.page, size: this.size }
      if (lnvoiceStatus) { this.params['lnvoiceStatus'] = lnvoiceStatus }
      if (drawwe) {
        this.params['drawwe'] = drawwe
      }
      if (lnvoiceOrder) {
        this.params['lnvoiceOrder'] = lnvoiceOrder
      }
      return true
    },
    //查询受票人
    getBindingContractByDrawwe() {
      getBindingContractByDrawwe().then(res => {
        this.drawweList = res
      }).catch(err => {

      })
    },
    // 导出
    download() {
      if (this.lvnoiceOrderList == '') {
        this.$notify({
          title: '请选择要操作的数据',
          type: 'error',
          duration: 2500
        })
      } else {
        this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          const tHeader = ['申请单号', '合同号', '合同日期', '申请单状态', '受票人', '承运方', '开票金额', '申请人', '申请时间', '运营审核人', '运营审核时间',
            '运营审核意见', '财务审核人', '财务审核时间', '财务审核意见', '发票号码'
          ]
          const filterVal = ['lnvoiceOrder', 'contNo', 'contDate', 'lnvoiceStatus', 'drawwe',
            'carrier', 'lnvoiceMoney', 'creatorName', 'creatDate',
            'operationName', 'operationDate', 'operationComments', 'financialName',
            'financialDate', 'financialComments', 'invoiceNumber'
          ]
          const data = this.formatJson(filterVal, this.lvnoiceOrderList)
          excel.export_json_to_excel({
            header: tHeader, //表头
            data, //数据
            filename: '开票管理_' + this.parseTime(new Date()) //文件名
          })
        })
        this.downloadLoading = false
      }
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'contDate' || j === 'operationDate' || j === 'creatDate' || j === 'financialDate') {
          return parseTime(v[j])
        }
        else if(j === 'lnvoiceStatus'){
          return parseStatus(v[j])
        }
        else {
          return v[j]
        }
      }))
    },
    //批量操作
    handleSelectionChange(val) {
      var lvnoiceOrderList = []
      this.multipleSelection = val;
      for (var i = 0; i < this.multipleSelection.length; i++) {
        lvnoiceOrderList.push(this.multipleSelection[i])
      }
      this.lvnoiceOrderList = lvnoiceOrderList
    },
    //审核详情
    verifyInfo(data){
       const _this = this.$refs.form

       _this.dialog = true
    },
    //申请明细
    definite(data){
      const _this = this.$refs.applicationForm
        _this.contractId = data.sysContractId
        _this.init()
        _this.dialog = true
      },

  }
}
</script>

<style scoped>

</style>
