<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :isAdd="isAdd" />
    <el-row :gutter="24">
      <el-col>
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
            <el-row>
             <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
               <span class="label">合同号:</span>
               <el-input v-model="query.contractNum" clearable placeholder="请输入合同号" style="width: 200px;" @keyup.enter.native="toQuery"/>
             </el-col>
             <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"  class="filter-item">
               <span class="label">受票人:</span>
              <el-select filterable  v-model="query.drawwe" clearable placeholder="请选择受票人" >
                  <el-option
                    v-for="item in drawweList"
                    :key="item.id"
                    :label="item.drawwe"
                    :value="item.drawwe">
                  </el-option>
              </el-select>
             </el-col>
             <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8"  class="filter-item">
              <span class="label">承运方:</span>
              <el-select filterable  v-model="query.carrier"  clearable placeholder="请输入承运方"  @keyup.enter.native="toQuery" style="width: 200px;">
                  <el-option
                    v-for="item in dictMap.carrier"
                    :key="item.value"
                    :label="item.label"
                    :value="item.id" >
                  </el-option>
              </el-select>
             </el-col>
            </el-row>
            <el-row >
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
                <span class="label">开始时间:</span>
                <el-date-picker clearable style="width: 200px;" v-model="query.startDate"  type="date" placeholder="选择开始日期"></el-date-picker>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"  class="filter-item">
                <span class="label">结束时间:</span>
                <el-date-picker style="width: 200px;" clearable v-model="query.endDate"  type="date" placeholder="选择截止日期" ></el-date-picker>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col  :offset="20">
                <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
                <el-button  class="filter-item" size="mini" type="primary" icon="el-icon-refresh-left" @click="reset('ruleForm')">重置</el-button>
              </el-col>
            </el-row>

      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','CONTRACT_ALL','CONTRACT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 作废 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_CANCEL']"
          class="filter-item"
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="cancel">作废</el-button>
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
    </div>
    <!--表格渲染-->
    <div  ref="tableRef" style="height:auto;">
      <el-table height="500" @selection-change="handleSelectionChange" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column label="合同编号" align="center">
      <template  slot-scope="scope">
        <a style="font-weight: 700;"  @click="edit(scope.row)">{{scope.row.contractNo}}</a>
      </template>
      </el-table-column>
      <el-table-column prop="contractStatusName" label="合同状态"/>
      <el-table-column prop="createDate" label="合同创建日期" width="120" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractNum" label="合同号"/>
      <el-table-column prop="identificationNumber" label="纳税人识别号"/>
      <el-table-column prop="drawwe" label="客户名称"/>
      <el-table-column prop="carrierName" label="承运方"/>
      <el-table-column prop="startDate" label="生效日期" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="失效日期" sortable>
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="制单人"/>
      <el-table-column  prop="contractImage" label="合同附件">
      <template slot-scope="scope">
         <span slot="reference" :alt="scope.row.contractImage" >
           <a v-if="scope.row.contractImage!=null" :href="scope.row.contractImage" target="_blank">查看</a>
         </span>
       </template>
      </el-table-column>
    </el-table>
    </div>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      :current-page="page + 1"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
      </el-col>
     </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime } from '@/utils/index'
import eForm from './form'
import store from '@/store'
import { getBindingContractByDrawwe,bindingContractCancel } from '@/api/bindingContract'

export default {
  components: { eForm},
  mixins: [initData,initDict],
  data() {
    return {
      userId:'',      //用户id
      tableHeight:300,//表格高度
      contractList:[],//保存已勾选的合同集合
      drawweList:[],//受票人集合
      delLoading: false,
      vertifys:[],//保存审核的集合
      cancelId:'',//保存作废合同id
      downloadLoading:false,//审核加载中
      multipleSelection: [],
    }
  },
  created() {
    this.$nextTick(() => {
      store.dispatch('GetInfo').then(res => {
        this.userId=res.id
        this.init()
      })
      this.getBindingContractByDrawwe()
    })
  },
  mounted(){
    this.tableHeight = window.innerHeight-this.$refs.tableRef.offsetTop-60
    console.log(window.innerHeight)
    console.log(this.$refs.tableRef.offsetTop)
  },
  methods: {
    reset(){
      this.$set(this.query,'contractNum','')
      this.$set(this.query,'drawwe','')
      this.$set(this.query,'carrier','')
      this.$set(this.query,'startDate',null)
      this.$set(this.query,'endDate',null)
       this.init()
    },
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/bindingContract'
      const sort = 'id,desc'
      const query = this.query
      const contractNum = query.contractNum
      const carrier = query.carrier
      const drawwe = query.drawwe
      const startDate = query.startDate
      const endDate = query.endDate
      this.params = { page: this.page, size: this.size, sort: sort ,userId:this.userId}
      //最高级别查询所有数据
	    if (contractNum) { this.params['contractNum'] = contractNum }
      if (drawwe) { this.params['drawwe'] = drawwe }
      if (carrier) { this.params['carrier'] = carrier }
      if (startDate) { this.params['startDate'] = parseTime(startDate) }
      if (endDate) { this.params['endDate'] =  parseTime(endDate) }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = false
      this.$refs.form.dialog = true
    },
    //作废
    cancel() {
      const _this = this.$refs.form
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
        this.$confirm('确认将合同作废, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
               bindingContractCancel(this.vertifys[0]).then(res => {
                 this.$notify({
                   title: '操作成功',
                   type: 'success',
                   duration: 2500
                 })
                 this.init()
                 }).catch(err => {
                   console.log(err.response.data.message)
                 })
            }).catch(() => {

            });
         }
    },
    //查看详情
    edit(data){
      this.isAdd = true
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        drawwe: data.drawwe,
        carrierId: data.carrierId,
        startDate: data.startDate,
        endDate: data.endDate,
        createDate: data.createDate,
        contractNum: data.contractNum,
        contractTitle: data.contractTitle,
        contractName: data.contractName,
        contractText:  data.contractText,
        contractRemark: data.contractRemark,
        contractImage: data.contractImage,
        contractYear:data.contractYear,
        contractStatusId:data.contractStatusId,
        identificationNumber:data.identificationNumber,
        creator:data.creator
      }
      _this.imageFrontUrl=data.contractImage
       _this.dialog = true
    },
    //查询受票人
    getBindingContractByDrawwe(){
        getBindingContractByDrawwe().then(res => {
          this.drawweList=res
        }).catch(err => {

        })
    },
    // 导出
    download() {
      if(this.vertifys==''){
          this.$notify({
            title: '请选择要操作的数据',
            type: 'error',
            duration: 2500
          })
      }else{
        this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          const tHeader = ['合同编号', '合同状态','合同创建日期', '合同号', '客户名称', '承运方', '生效日期', '失效日期', '制单人', ]
          const filterVal = ['contractNo', 'contractStatusName','createDate', 'contractNum','drawwe', 'carrierName', 'startDate', 'endDate', 'creatorName']
          const data = this.formatJson(filterVal, this.contractList)
          excel.export_json_to_excel({
            header: tHeader,  //表头
            data,             //数据
            filename: '合同管理_'+this.parseTime(new Date()) //文件名
          })
        })
         this.downloadLoading = false
      }
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'startDate' || j === 'endDate' || j=== 'createDate') {
          return parseTime(v[j])
        }
         else {
          return v[j]
        }
      }))
    },
    //批量操作
    handleSelectionChange(val) {
    var isCheckbox=[] //保存已勾选的集合
    var contractList=[]
        this.multipleSelection = val;
        for (var i = 0; i < this.multipleSelection.length; i++) {
          isCheckbox.push(this.multipleSelection[i].id)
          contractList.push(this.multipleSelection[i])
        }
        this.vertifys = isCheckbox
        this.contractList=contractList
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
