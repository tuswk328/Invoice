<template>
  <div class="app-container">
    <!--工具栏-->
    <applicationForm ref="applicationForm" />
    <div class="head-container demo-input-suffix">
      <el-row>
         <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" class="filter-item">
           <span class="label">合同编号: </span>
            <el-input v-model="query.contractNo" clearable placeholder="请输入合同号" style="width: 200px;"  @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"  class="filter-item">
           <span class="label">运输清单号:</span>
            <el-input v-model="query.lotNo" clearable placeholder="请输入运输清单号" style="width: 200px;"  @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" class="filter-item">
          <span class="label">收货单位:</span>
          <el-select v-model="query.consigneeName" clearable filterable placeholder="请选择收货单位" style="width: 200px;">
              <el-option
                v-for="item in consigneeName"
                :key="item.value"
                :label="item.consigneeName"
                :value="item.consigneeName">
              </el-option>
          </el-select>
         </el-col>
         <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"  class="filter-item">
           <span class="label">车牌号:</span>
           <el-input v-model="query.headLicense" clearable placeholder="请输入车牌号码" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
         </el-col>
      </el-row>
      <el-row >
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"  class="filter-item">
             <span class="label">开始时间:  </span>
            <el-date-picker style="width: 200px;" clearable v-model="query.startDate" type="date" placeholder="选择开始日期"></el-date-picker>&nbsp;&nbsp;&nbsp;-
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"  class="filter-item">
            <span class="label"> 结束时间:  </span>
            <el-date-picker style="width: 200px;" clearable v-model="query.endDate" type="date" placeholder="选择截止日期" ></el-date-picker>
          </el-col>
         <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"  class="filter-item">
             <span class="label">合同状态: </span>
           <el-select v-model="query.consignmentStatus"  clearable placeholder="请输入合同状态"  @keyup.enter.native="toQuery">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" >
               </el-option>
           </el-select>
         </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="filter-item">
            <span class="label">申请单状态:</span>
            <el-select v-model="query.lnvoiceStatus" clearable filterable placeholder="请选择申请单状态" style="width: 200px;"
              @keyup.enter.native="toQuery">
              <el-option v-for="item in lnvoiceStatusList" :key="item.id" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col  :offset="20">
        <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button  class="filter-item" size="mini" type="primary" icon="el-icon-refresh-left" @click="reset('ruleForm')">重置</el-button>
      </el-col>
    </el-row>
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
    <!--表格渲染-->
   <!-- <order ref="order":data="data" :loading="loading"></order> -->
     <el-table height="500" @selection-change="handleSelectionChange" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" type="danger" @click="definite(scope.row)" size="mini">申请明细</el-button>
        </template>
      </el-table-column>
      <el-table-column label="合同号" prop="contractNo" align="center"/>
      <el-table-column  prop="contractStatus" label="合同状态" />
      <el-table-column prop="contractDate" label="合同时间" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.contractDate}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="contractCost" label="合同金额" />
      <el-table-column  prop="drawwe" label="受票人" />
       <el-table-column prop="lnvoiceStatus" label="申请单状态" sortable>
        <template slot-scope="scope">
          <span>{{parseStatus(scope.row.lnvoiceStatus)}}</span>
        </template>
      </el-table-column>
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
import order from '@/views/components/orderList'
import initData from '@/mixins/initData'
import { parseTime, number_format, parseStatus } from '@/utils/index'
import { findByOrder,findByconsigneeName } from '@/api/order'
import {lnvoiceCommonList} from '@/utils/common'
import applicationForm from './applicationForm'

export default {
  mixins: [initData],
  components:{order,applicationForm},
  data() {
    return {
      lnvoiceStatusList: lnvoiceCommonList, //保存申请单状态集合
      orderList:[],//保存选中的集合
      downloadLoading:false,//加载中
      multipleSelection: [],
      options: [{
        value: '已确认',
        label: '已确认'
      }, {
        value: '已撤回',
        label: '已撤回'
      }],
     consigneeName:[],//收货单位集合
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted() {
    this.findByconsigneeName()//查询收货单位
      },
  methods: {
    parseTime,
    parseStatus,
    number_format,
    //申请明细
    definite(data) {
      const _this = this.$refs.applicationForm
      _this.contractId = data.id
      _this.init()
      _this.dialog = true
    },
    beforeInit() {
      this.url = 'api/findByOrder'
      const query = this.query
      const contractNo = query.contractNo
      const lotNo = query.lotNo
      const consigneeName = query.consigneeName
      const startDate = query.startDate
      const endDate = query.endDate
      const headLicense = query.headLicense
      const consignmentStatus = query.consignmentStatus
      const lnvoiceStatus = query.lnvoiceStatus

      this.params = { page: this.page, size: this.size }
     if (contractNo) { this.params['contractNo'] = contractNo }
     if (lotNo) { this.params['lotNo'] = lotNo }
     if (consigneeName) { this.params['consigneeName'] = consigneeName }
     if (startDate) { this.params['startDate'] = parseTime(startDate) }
     if (endDate) { this.params['endDate'] = parseTime(endDate) }
     if (headLicense) { this.params['headLicense'] = headLicense }
     if (lnvoiceStatus) { this.params['lnvoiceStatus'] = lnvoiceStatus }
     if (consignmentStatus) { this.params['consignmentStatus'] = consignmentStatus }
      return true
    },
    cancel() {
      this.resetForm()
    },
    // 导出
    /* download() {
       this.downloadLoading = true
        this.$refs.order.download()
       this.downloadLoading = false
    }, */
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createDate' || j === 'orderDate' || j=== 'departDate' || j==='contractDate') {
          return parseTime(v[j])
        }
         else {
          return v[j]
        }
      }))
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
    //查询到货单位
    findByconsigneeName(){
          findByconsigneeName().then(res => {
            this.consigneeName=res
          }).catch(err => {
             console.log(err.response.data.message)
          })
      },
      //重置
      reset(){
          this.$set(this.query,'contractNo','')
          this.$set(this.query,'lotNo','')
          this.$set(this.query,'consigneeName','')
          this.$set(this.query,'startDate',null)
          this.$set(this.query,'endDate',null)
          this.$set(this.query,'headLicense','')
          this.$set(this.query,'consignmentStatus','')
          this.init()
      },
      //批量操作
      handleSelectionChange(val) {
      var orderList=[]
          this.multipleSelection = val;
          for (var i = 0; i < this.multipleSelection.length; i++) {
            orderList.push(this.multipleSelection[i])
          }
          this.orderList=orderList
      },
      download() {
        if(this.orderList==''){
            this.$notify({
              title: '请选择要操作的数据',
              type: 'error',
              duration: 2500
            })
        }else{
          import('@/utils/export2Excel').then(excel => {
            const tHeader = ['合同编号', '合同状态','合同时间', '运输清单号', '托运单号', '托运单状态', '运单创建日期', '下单时间', '发货单位', '收货单位','货物名称','件数','起站','到站','车辆信息','司机信息','发车时间','投保结果','失败原因','确认金额','投保金额']
           const filterVal= ['contractNo','contractStatus','contractDate', 'lotNo', 'systemOrderId','consignmentStatus', 'createDate', 'orderDate', 'shipperName', 'consigneeName','cargoName','cargoCount','departStation','arriveStation','headLicense','driverName','departDate','insureResult','insureReasons','insureMoney','confirmationAmount']
            const data = this.formatJson(filterVal, this.orderList)
            excel.export_json_to_excel({
              header: tHeader,  //表头
              data,             //数据
              filename: '订单管理_'+this.parseTime(new Date()) //文件名
            })
          })
        }
      },
      // 数据转换
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'createDate' || j === 'orderDate' || j=== 'departDate' || j==='contractDate') {
            return parseTime(v[j])
          }
           else {
            return v[j]
          }
        }))
      }
  }
}
</script>

<style scoped>
.label {
  display: inline-block;
  width: 100px;
  text-align: right;
}
</style>
