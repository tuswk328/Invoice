<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" />
    <applicationForm ref="applicationForm" />
    <!--工具栏-->
    <div class="head-container demo-input-suffix">
      <el-row>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="filter-item">
          <span class="label">申请单号:</span>
          <el-input v-model="query.lnvoiceOrder" clearable placeholder="请输入申请单号" style="width: 200px;"
            @keyup.enter.native="toQuery" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="filter-item">
          <span class="label">申请单状态:</span>
          <el-select v-model="query.lnvoiceStatus" clearable filterable placeholder="请选择申请单状态" style="width: 200px;"
            @keyup.enter.native="toQuery">
            <el-option v-for="item in lnvoiceStatusList" :key="item.id" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="filter-item">
          <span class="label">受票人:</span>
          <el-select v-model="query.drawwe" clearable filterable placeholder="请选择受票人" style="width: 200px;"
            @keyup.enter.native="toQuery">
            <el-option v-for="item in drawweList" :key="item.id" :label="item.drawwe" :value="item.drawwe">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="20">
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <!-- 导出 -->
    </div>
    <div style="display: inline-block;">
      <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download"
        @click="download">导出</el-button>
    </div>
    <!--表格渲染-->
    <el-table :summary-method="getSummaries"
    show-summary  @selection-change="handleSelectionChange" v-loading="loading"
      :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection" />
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="verifyInfo(scope.row)">审核详情</el-button>
          <el-button slot="reference" type="danger" @click="definite(scope.row)" size="mini">申请明细</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="lnvoiceOrder" label="申清单号" width="150" sortable />
      <el-table-column prop="lnvoiceStatus" label="申请单状态" width="150" sortable>
        <template slot-scope="scope">
          <span>{{parseStatus(scope.row.lnvoiceStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="drawwe" label="受票人" width="100" />
      <el-table-column prop="carrier" label="承运方" width="100" />
      <el-table-column prop="lnvoiceMoney" label="开票金额" width="100">
        <template slot-scope="scope">
          <span>{{number_format(scope.row.lnvoiceMoney, 2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="申请人" width="100" />
      <el-table-column prop="creatDate" label="申请时间" width="150" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creatDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operationName" label="运营审核人" width="100" />
      <el-table-column prop="operationDate" label="运营审核时间" width="150" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operationDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operationComments" label="运营审核意见" width="100">
          <template slot-scope="scope">
             <el-tooltip class="item" effect="light" :content="scope.row.operationComments" placement="bottom-start">
                <span>{{ scope.row.operationComments==null?null:scope.row.operationComments.substring(0,10) }}</span>
             </el-tooltip>
          </template>
      </el-table-column>
      <el-table-column prop="financialName" label="财务审核人" width="100" />
      <el-table-column prop="financialDate" label="财务审核时间" width="150" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.financialDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="financialComments" label="财务审核意见" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" :content="scope.row.financialComments" placement="bottom-start">
            <span>{{ scope.row.financialComments==null?null:scope.row.financialComments.substring(0,10) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="lnvoiceNumber" label="发票号码" width="150" />
    </el-table>
    <!--分页组件-->
    <el-pagination :total="total" :current-page="page + 1" style="margin-top: 8px;" layout="total, prev, pager, next, sizes"
      @size-change="sizeChange" @current-change="pageChange" />
  </div>
</template>

<script>
  import initData from '@/mixins/initData'
  import {
    parseTime,
    number_format,
    parseStatus
  } from '@/utils/index'
  import eForm from './form'
  import applicationForm from './applicationForm'
  import {
    getBindingContractByDrawwe
  } from '@/api/bindingContract'
  import {
    findByAuditLog,
    findByLnvoiceInfo
  } from '@/api/verify'
  import {
    lnvoiceCommonList
  } from '@/utils/common'


  export default {
    mixins: [initData],
    components: {
      eForm,
      applicationForm
    },
    data() {
      return {
        lnvoiceStatusList: lnvoiceCommonList,
        downloadLoading: false,
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
    mounted() {},
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
        this.params = {
          page: this.page,
          size: this.size
        }
        if (lnvoiceStatus) {
          this.params['lnvoiceStatus'] = lnvoiceStatus
        }
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
            const tHeader = ['申请单号','申请单状态', '受票人', '承运方', '开票金额', '申请人', '申请时间', '运营审核人', '运营审核时间',
              '运营审核意见', '财务审核人', '财务审核时间', '财务审核意见', '发票号码'
            ]
            const filterVal = ['lnvoiceOrder', 'lnvoiceStatus', 'drawwe',
              'carrier', 'lnvoiceMoney', 'creatorName', 'creatDate',
              'operationName', 'operationDate', 'operationComments', 'financialName',
              'financialDate', 'financialComments', 'lnvoiceNumber'
            ]
            const data = this.formatJson(filterVal, this.lvnoiceOrderList)
            excel.export_json_to_excel({
              header: tHeader, //表头
              data, //数据
              filename: '审核管理_' + this.parseTime(new Date()) //文件名
            })
          })
          this.downloadLoading = false
        }
      },
      // 数据转换
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if ( j === 'operationDate' || j === 'creatDate' || j === 'financialDate') {
            return parseTime(v[j])
          } else if (j === 'lnvoiceStatus') {
            return parseStatus(v[j])
          } else {
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
      verifyInfo(data) {
        const _this = this.$refs.form
        _this.dialog = true
        _this.lnvoiceId = data.id
        _this.init()
        findByLnvoiceInfo(data.id).then(res => {
          if (res != '') {
            _this.form = res
          _this.form.contCost=this.number_format(res.contCost)
          _this.form.lnvoiceMoney=this.number_format(res.lnvoiceMoney)
          }
        }).catch(err => {
          console.log(err)
        })

      },
      //申请明细
      definite(data) {
        const _this = this.$refs.applicationForm
        _this.contractId = data.id
        _this.init()
        _this.dialog = true
      },
      //数据金额
       getSummaries(param) {
              const { columns, data } = param;
              const sums = [];
              columns.forEach((column, index) => {
                if (index === 0) {
                  sums[index] = '总价';
                  return;
                }
               else if (index === 6) {
                  const values = data.map(item => Number(item[column.property]));
                  if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                      const value = Number(curr);
                      if (!isNaN(value)) {
                        return prev + curr;
                      } else {
                        return prev;
                      }
                    }, 0);
                    sums[index] += ' 元';
                  } else {
                    sums[index] = 'N/A';
                  }
                }
              });
              return sums;
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
