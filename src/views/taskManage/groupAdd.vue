<template>
  <div class="form-container">
    <el-form ref="form" :model="form" label-width="110px" class="form">
      <el-form-item label="任务组名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="数据库仓库层级">
        <el-select v-model="form.dataLevel" placeholder="请选择">
          <el-option label="SSA" value="SSA"></el-option>
          <el-option label="SOR" value="SOR"></el-option>
          <el-option label="DPA" value="DPA"></el-option>
          <el-option label="DM" value="DM"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组描述">
        <el-input type="textarea" v-model="form.descripe"></el-input>
      </el-form-item>

      <el-form-item label="首次运行日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.createTime" style="width: 50%;" @change="timeHandler('createTime')"></el-date-picker>
      </el-form-item>
      <el-form-item label="调度结束日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" style="width: 50%;" @change="timeHandler('endDate')"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSave">保存</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="warning" native-type="reset" @click="reset">重置</el-button>
        <el-button @click="editorDialogVisable = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { saveOrUpdate } from 'api/group';
  import { parseTime, timeToStamp } from 'utils'

  export default {
    data() {
      return {
        form: {
          id: undefined,
          name: '',
          userName: '',
          dataLevel: '',
          createTime: '',
          endDate: '',
          descripe: '',
          beginDate: '',
          updateTime: '',
        },
        loading: false
      }
    },
    mounted() {

    },
    methods: {
      onSubmit() {
        this.form.updateTime = parseTime(new Data())
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
              this.$refs.form.$el.reset()
              this.reset()
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              });
            }
        })
      },
      onSave() {
        this.form.updateTime = parseTime(new Data())        
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
              this.$refs.form.$el.reset()
              this.reset()
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              });
            }
        })
      },
      reset() {
        
      },
      timeHandler(key) {
        timeToStamp(key, this.form)
      }
    }
  }
</script>

<style lang="scss">
  @import "src/styles/mixin.scss";

  .form-container {
      @include flex;
      @include flex-justify;
      padding: 20px;
      .form {
        width: 500px;
      }
  }
</style>
