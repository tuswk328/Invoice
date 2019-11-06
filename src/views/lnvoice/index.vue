<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container demo-input-suffix">
      <el-row type="flex" class="row-bg" justify="space-around" >
         <el-col >
           申请单号:
            <el-input v-model="query.name" clearable placeholder="请输入合同号" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
         </el-col>
         <el-col >
           合同号:
            <el-input v-model="query.name" clearable placeholder="请输入收货单位" style="width: 300px;" class="filter-item" @keyup.enter.native="toQuery"/>
         </el-col>
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
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
         <el-col >
           受票人:
           <el-select v-model="query.value" filterable placeholder="请选择受票人">
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
           </el-select>
         </el-col>
         <el-col >
           承运方:
           <el-select v-model="query.status"  clearable placeholder="请输入承运方" class="filter-item" @keyup.enter.native="toQuery" style="width: 300px;">
               <el-option
                 v-for="item in options1"
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
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
        { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
        { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
        { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
        { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
        { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
        { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
        { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
        { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
        { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
        { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
        { "value": "枪会山", "address": "上海市普陀区棕榈路" },
        { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
        { "value": "钱记", "address": "上海市长宁区天山西路" },
        { "value": "壹杯加", "address": "上海市长宁区通协路" },
        { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
        { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
        { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
        { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
        { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
        { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
        { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
        { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
        { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
        { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
        { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
        { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
        { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
        { "value": "浏阳蒸菜", "address": "天山西路430号" },
        { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
        { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
        { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
        { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
        { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
        { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
        { "value": "阳阳麻辣烫", "address": "天山西路389号" },
        { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
      ];
    },
    handleSelect(item) {
      console.log(item);
    }
  }
}
</script>

<style scoped>

</style>
