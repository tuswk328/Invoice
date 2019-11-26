<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增合同' : '编辑合同'" width="700px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">合同信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同年度" prop="contractYear" label-width="120px">
            <el-input :disabled="isAdd" v-model="form.contractYear" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同号" label-width="120px">
            <el-input :disabled="isAdd" v-model="form.contractNum" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="甲方" prop="drawwe" label-width="120px">
            <el-input :disabled="isAdd" v-model="form.drawwe" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="乙方" prop="carrierId" label-width="120px">
           <el-select :disabled="isAdd" v-model="form.carrierId"  placeholder="请选择承运方" style="width: 170px;">
             <el-option  v-for="(item, index) in carrierList"
               :key="item.index"
               :label="item.name"
               :value="item.id"
               />
           </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="纳税人识别号" prop="identificationNumber" label-width="120px">
            <el-input :disabled="isAdd" v-model="form.identificationNumber" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="申请日期" prop="createDate" label-width="120px">
             <el-date-picker :disabled="isAdd"   v-model="form.createDate" type="date" placeholder="选择日期" style="width: 170px;">
             </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生效日期" prop="startDate" label-width="120px">
            <el-date-picker :disabled="isAdd" :picker-options="pickerOptions0" value-format="yyyy-MM-dd"  v-model="form.startDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失效日期" prop="endDate" label-width="120px">
            <el-date-picker :disabled="isAdd" :picker-options="pickerOptions1" value-format="yyyy-MM-dd" v-model="form.endDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="合同名称" >
             <el-input v-model="form.contractName" :disabled="isAdd" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="合同标题" >
             <el-input v-model="form.contractTitle" :disabled="isAdd" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="合同内容">
           <el-input type="textarea" rows="8" v-model="form.contractText" :disabled="isAdd"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" >
            <el-input type="textarea" rows="5" v-model="form.contractRemark" :disabled="isAdd"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">合同附件</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文件名" >
          <el-upload
            class="avatar-uploader"
            v-show="imageFrontUrl == null"
            name="upfile"
            drag
            :headers="headers"
            :with-credentials=true
            :action="uploadUrl"
            :before-upload="beforeUpload"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
            <p v-if="imageFrontFile != null">文件名称: {{ imageFrontFile.name }}</p>
            <p v-else>点击或拖拽文件上传</p></div>
          </el-upload>
            <div v-if="imageFrontUrl != null">
              <a  :href="imageFrontUrl" target="_blank" style="font-size: 20px;"><i class="el-icon-folder"></i>
              </a>{{ imageFrontFile.name }}&nbsp;&nbsp;<i class="el-icon-circle-check" style="color: green;">
              </i>
              <!-- <img class="avatar" :src="imageFrontUrl" /> -->
              <el-button outline  @click="clearFile">清除</el-button>
             </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!isAdd">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add,upload ,edit} from '@/api/bindingContract'
import { gerDeptScope} from '@/api/dept'
import store from '@/store'
import { getToken } from '@/utils/auth'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  created() {
    this.getCarrier()
  },
  data() {
    return {
      carrierList:[],//承运方集合
      pickerOptions0: {
          disabledDate: (time) => {
              if (this.form.endDate != null) {
                  return time.getTime() > new Date(this.form.endDate).getTime();
            }
         }
      },
      pickerOptions1: {
          disabledDate: (time) => {
              return time.getTime() < new Date(this.form.startDate).getTime();//减去一天的时间代表可以选择同一天;
          }
      },
      imageFrontUrl:null, //文件上传路径
      imageFrontFile:'',//接受文件上传的参数
      isShowUploading: false,//文件上传加载中
      headers: {//设置请求头
               'Authorization': 'Bearer '+ getToken()
            },
	    uploadUrl:'',//文件上传路径
      loading: false,
      dialog: false,
      form: {
        id: '',
        drawwe: '',
        carrierId: '',
        startDate: null,
        endDate: null,
        createDate: null,
        contractNum: '',
        contractTitle: '',
        contractName: '',
        contractText: '',
        contractRemark: '',
        contractImage: '',
        contractYear:'',
        contractStatusId:18,
        creator:'',
        deptId:''
      },
      rules: {//表达验证
        identificationNumber: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
        ],
        contractYear: [
          { required: true, message: '请输入合同年限', trigger: 'blur' }
        ],
        drawwe: [
          { required: true, message: '请输入受票人', trigger: 'change' }
        ],
        carrierId: [
          { required: true, message: '请输入承运方', trigger: 'change' }
        ],
        startDate: [
          {  required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        createDate: [
          {  required: true, message: '请选择申请日期', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {  //校验表单
        if (valid) {
           this.loading=true;
        if (this.isAdd) {
          this.doEdit()
        } else
              this.doAdd()
        } else {
          return false
        }
      })
    },
    doAdd() {
     store.dispatch('GetInfo').then(res => {
         this.form.creator = res.id
         this.form.deptId = res.deptId
         add(this.form).then(res => {
           this.resetForm()
            this.clearFile()
           this.$notify({
             title: '添加成功',
             type: 'success',
             duration: 2500
           })
           this.loading = false
           this.imageFrontFile=''
           this.$parent.init()
		       this.$parent.getBindingContractByDrawwe()
         }).catch(err => {
           this.loading = false
           console.log(err.response.data.message)
         })
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.imageFrontFile=''
        this.$parent.init()
        this.$parent.getBindingContractByDrawwe()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        drawwe: '',
        carrierId: '',
        startDate: null,
        createDate:null,
        endDate: null,
        contractNo: '',
        contractTitle: '',
        contractName: '',
        contractText: '',
        contractRemark: '',
        contractImage: '',
        contractYear:'',
        contractStatusId:18,
        creator:''
      }
      this.clearFile()
    },
    //文件上传
    beforeUpload(file){
      this.loading=true
      this.imageFrontFile = file;
        let fileName = file.name;
        var fileData = new FormData();
        fileData.append('upfile', file);
        let suffix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
        if (suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "pdf") {
            //格式正确,判断大小在1M以内
            let fileSize = file.size;
            if (fileSize > 10240 * 10240) {
                //文件太大
                this.imageFrontUrl = '';
                this.$notify.error({
                    title: '文件太大',
                    duration:5,
                    closable: true
                });
                this.loading= false
            } else {
              store.dispatch('GetInfo').then(res => {
                 upload(fileData,'CU'+res.username).then(res => {
                   this.form.contractImage=res
                   this.imageFrontUrl=res
                   this.isShowUploading=false
                   this.loading= false
                   this.$notify({
                    title: '上传成功',
                    type: 'success',
                    duration: 2500
                  })
                 }).catch(err => {
                     this.$notify({
                       title: '上传失败',
                       type: 'error',
                       duration: 2500
                     })
                      this.loading= false
                 })
               })
            }
        } else {
            this.imageFrontUrl = '';
            this.loading= false
            //格式错误
            this.$notify.error({
                title: '文件格式错误',
                duration:5,
                closable: true
            });
        }
    },
    //清除文件
    clearFile(){
        this.imageFrontUrl = null;
        this.form.fileName = '';
        this.imageFrontFile = '';
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
