<template>
  <div class="form-container">
    <el-form ref="form" :model="form" label-width="110px" class="form">
      <el-form-item label="任务组名">
        <el-input v-model="form.groupName"></el-input>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="数据库仓库层级">
        <el-select v-model="form.db" placeholder="请选择">
          <el-option label="SSA" value="SSA"></el-option>
          <el-option label="SOR" value="SOR"></el-option>
          <el-option label="DPA" value="DPA"></el-option>
          <el-option label="DM" value="DM"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组描述">
        <el-input type="textarea" v-model="form.groupDesc"></el-input>
      </el-form-item>

      <el-form-item label="首次运行日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.createDate" style="width: 50%;" @change="timeToStamp('createDate')"></el-date-picker>
      </el-form-item>
      <el-form-item label="调度结束日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.loseDate" style="width: 50%;" @change="timeToStamp('loseDate')"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" >保存</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="warning" native-type="reset">重置</el-button>
        <el-button @click="editorDialogVisable = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          id: undefined,
          groupName: '',
          db: 'SSA',
          createDate: '',
          loseDate: '',
          groupDesc: '',
          updateTime: 0,
        },
        loading: false
      }
    },
    mounted() {

    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      timeToStamp(key) {
          if (!/\d{10}/ig.test(this.form[key])) {
            this.form[key] = new Date(this.form[key]).getTime()
          }
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
