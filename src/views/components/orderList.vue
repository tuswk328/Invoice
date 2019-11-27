<template>
  <div >
    <el-table  @selection-change="handleSelectionChange" :v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column label="合同号" prop="contractNo" width="150" />
      <el-table-column  prop="contractStatus" label="合同状态"/>
      <el-table-column prop="contractDate" label="合同时间" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.contractDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="lotNo" label="运输清单号" width="150"/>
      <el-table-column  prop="systemOrderId" label="托运单号" width="150"/>
      <el-table-column  prop="consignmentStatus" label="托运单状态" width="100"/>
      <el-table-column prop="createDate" label="运单创建日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderDate" label="下单时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="shipperName" label="发货单位" width="150"/>
      <el-table-column  prop="consigneeName" label="收货单位" width="150"/>
      <el-table-column  prop="cargoName" label="货物名称"  width="100"/>
      <el-table-column  prop="cargoCount" label="件数"/>
      <el-table-column  prop="departStation" label="起站" width="100"/>
      <el-table-column  prop="arriveStation" label="到站" width="100"/>
      <el-table-column  prop="headLicense" label="车辆信息" width="150"/>
      <el-table-column  prop="driverName" label="司机信息" width="100"/>
      <el-table-column prop="departDate" label="发车时间" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.departDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="insureResult" label="投保结果"/>
      <el-table-column prop="insureReasons" label="失败原因"/>
      <el-table-column prop="insureMoney" label="确认金额"/>
      <el-table-column prop="confirmationAmount" label="投保金额"/>
    </el-table>
  </div>
</template>

<script>
  import { parseTime } from '@/utils/index'
  export default {
    props:{
      loading:Boolean,//加载中
      data:Array,
    },
    data() {
      return {
        orderList:[],
        multipleSelection: [],
      }
    },
    created() {

    },
    mounted() {
        },
    methods: {
      parseTime,
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
      },
    }
  }

</script>

<style>
</style>
