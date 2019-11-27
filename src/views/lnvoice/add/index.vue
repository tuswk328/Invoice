<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form"/>
    <!--工具栏-->
    <div class="head-container">
      <el-form ref="query" :rules="rules" :model="query" label-width="100px">
        <el-row>
           <el-col  :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
               <el-form-item label="受票人:" prop="drawwe">
                 <el-select v-model="query.drawwe" clearable filterable placeholder="请选择受票人" style="width: 200px;" @keyup.enter.native="toQuery">
                     <el-option
                       v-for="item in drawweList"
                       :key="item.id"
                       :label="item.drawwe"
                       :value="item.drawwe">
                     </el-option>
                 </el-select>
                </el-form-item>
           </el-col>
           <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
           <el-form-item label="承运方:" >
             <el-select filterable  v-model="query.carrier"  clearable placeholder="请输入承运方"  @keyup.enter.native="toQuery" style="width: 200px;">
                 <el-option
                   v-for="item in carrierList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.id" >
                 </el-option>
             </el-select>
           </el-form-item>
           </el-col>
           <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="filter-item">
             <el-form-item label="合同号:">
                <el-input v-model="query.contNo" clearable placeholder="请输入合同号" style="width: 200px;"  @keyup.enter.native="toQuery"/>
             </el-form-item>
           </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
           <el-form-item label="开始时间:">
            <el-date-picker clearable style="width: 200px;" v-model="query.startDate"  type="date" placeholder="选择开始日期"></el-date-picker>
           </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
            <el-form-item label="结束时间:">
              <el-date-picker style="width: 200px;" clearable v-model="query.endDate"  type="date" placeholder="选择截止日期" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col  :offset="20">
          <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="doQuery">搜索</el-button>
          <el-button  class="filter-item" size="mini" type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-col>
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
    <el-table height="500" @selection-change="handleSelectionChange" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column label="合同号"   prop="contNo"/>
      <el-table-column  prop="contStatus" label="合同状态"/>
      <el-table-column  prop="engine" label="合同日期" sortable>
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.contDate) }}</span>
          </template>
       </el-table-column>
      <el-table-column prop="drawwe" label="受票人"/>
      <el-table-column prop="contCost" label="合同金额" sortable/>
      <el-table-column  prop="count" label="总件数"/>
      <!-- <el-table-column  prop="engine" label="所属合同"/> -->
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
import { gerDeptScope} from '@/api/dept'
import { parseTime } from '@/utils/index'
import store from '@/store'
import { findLnvoiceContract,findBySaveLnvoice } from '@/api/lnvoice'
import { findByDrawweAndConDate,getBindingContractByDrawwe } from '@/api/bindingContract.js'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      userId:'',
      carrierList:[],//承运方集合
      drawweList:[],//受票人集合
      vertifys:[],//保存选中的那个id
      multipleSelection: [],
      vertifyLoading:false,
      rules: {
        drawwe: [
          { required: true, message: '请选择受票人', trigger: 'change' }
        ],
      }
    }
  },
  created() {
    this.$nextTick(() => {
        this.loading=false
        this.getBindingContractByDrawwe()
        this.getCarrier()
    })
  },
  mounted() {
      },
  methods: {
    parseTime,
    //搜索查询验证
    doQuery() {
      this.$refs['query'].validate((valid) => {
        if (valid) {
          this.toQuery()
        }
      })
    },
    beforeInit() {
      this.url = 'api/findLnvoiceContract'
      const query = this.query
      const carrier = query.carrier
      const drawwe = query.drawwe
      const contNo = query.contNo
      const startDate = query.startDate
      const endDate = query.endDate
      this.params = { page: this.page, size: this.size }
      if (drawwe) { this.params['drawwe'] = drawwe }
      if (carrier) { this.params['carrier'] = carrier }
      if (contNo) { this.params['contNo'] = contNo }
      if (startDate) { this.params['startDate'] = parseTime(startDate) }
      if (endDate) { this.params['endDate'] = parseTime(endDate) }
      return true
    },
    cancel() {
      this.resetForm()
    },
    reset(){
      this.$set(this.query,'carrier','')
      this.$set(this.query,'drawwe','')
      this.$set(this.query,'contNo','')
      this.$set(this.query,'startDate',null)
      this.$set(this.query,'endDate',null)
      this.init()
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
          this.$refs.form.contractId = this.vertifys[0].id
          _this.form = {
            drawwe: this.vertifys[0].drawwe,
            lnvoiceMoney: this.vertifys[0].contCost,
            contCost: this.vertifys[0].contCost,
          }
          _this.dialog = true
          /* 根据受票人日期查询承运方集合*/
          findByDrawweAndConDate(this.vertifys[0]).then(res => {
             this.$refs.form.carrierList=res
          }).catch(err => {
             console.log(err.response.data.message)
          })
       }
     },
     //查询受票人
      getBindingContractByDrawwe(){
      getBindingContractByDrawwe().then(res => {
        this.drawweList=res
      }).catch(err => {
      })
      },
      getCarrier(){
      //查询承运方
       gerDeptScope().then(res => {
         this.carrierList=res
       }).catch(err => {
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
