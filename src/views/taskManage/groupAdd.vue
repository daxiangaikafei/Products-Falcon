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
        <el-input type="textarea" v-model="form.describe"></el-input>
      </el-form-item>

      <el-form-item label="首次运行日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" style="width: 50%;" @change="timeHandler('beginDate')"></el-date-picker>
      </el-form-item>
      <el-form-item label="调度结束日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" style="width: 50%;" @change="timeHandler('endDate')"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="save">保存</el-button>
        <el-button type="primary" @click="commit">提交</el-button>
        <el-button type="warning" native-type="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { run, saveOrUpdate } from 'api/group';
  import { parseTime, timeToStamp } from 'utils'

  export default {
    data() {
      return {
        form: {
          projectId: undefined,
          name: '',
          userName: '',
          dataLevel: '',
          describe: '',
          status: '',
          beginDate: '',
          endDate: '', 
        },
        loading: false
      }
    },
    mounted() {

    },
    methods: {
      commit() {
        run(this.form.projectId).then(response => {
          if (response.success) {
              this.$notify({
                title: '成功',
                message: '提交成功',
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
      save() {
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
            this.form.projectId = response.data
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
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
        this.form[key] = parseTime(this.form[key])
        // timeToStamp(key, this.form)
        // console.log(this.form[key]);
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
