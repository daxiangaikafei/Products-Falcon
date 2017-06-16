<template>
  <div class="form-container">
    <el-form ref="form" :model="form" label-width="110px" class="form">
    <el-form-item label="任务名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="任务脚本名">
      <el-input v-model="form.scriptName"></el-input>
    </el-form-item>
    <el-form-item label="操作人">
      <el-input v-model="form.userName  "></el-input>
    </el-form-item>
    <el-form-item label="数据库仓库层级">
      <el-select v-model="form.db" placeholder="请选择">
        <el-option label="SSA" value="SSA"></el-option>
        <el-option label="SOR" value="SOR"></el-option>
        <el-option label="DPA" value="DPA"></el-option>
        <el-option label="DM" value="DM"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="依赖任务">
      <!--<el-col :span="21">-->
      <!--<el-input v-model="form.referJobIds"></el-input>-->
      <el-select
          v-model="form.referJobIds"
          multiple
          filterable
          remote
          placeholder="查询并选择依赖"
          :remote-method="getReferJobIds"
          :loading="loading"
          style="width:100%">
          <el-option
            v-for="item in referJobIdsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <!--</el-col>-->
      <!--<el-col :span="1" :offset="1">
        <el-popover
          ref="popover4"
          placement="right"
          width="400"
          trigger="click">
        </el-popover>
        <el-button type="text" v-popover:popover4><Icon :icon-name="'plus-circle'" :size="18" /></el-button>
        </el-col>-->
    </el-form-item>
    <el-form-item label="所属组">
      <el-select
          v-model="form.ownerProjects"
          :multiple="false"
          clearable
          filterable
          remote
          placeholder="查询并选择任务组"
          :remote-method="getOwnerProjects"
          :loading="loading"
          style="width:100%">
          <el-option
            v-for="item in ownerProjectsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="运行周期">
      <el-select v-model="form.cycle" placeholder="请选择">
        <el-option label="每日" value="daily"></el-option>
        <el-option label="每周" value="weekly"></el-option>
        <el-option label="每月" value="monthly"></el-option>
        <el-option label="每年" value="yearly"></el-option>
        <el-option label="每小时" value="hourly"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="运行时间点">
        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.exeTime" format="HH:mm" style="width: 50%;" @change="timeHandler('exeTime')"></el-time-picker>
    </el-form-item>
    <el-form-item label="首次运行日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.startDate" style="width: 50%;" @change="timeHandler('startDate')"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="onSave" >保存</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button type="warning" native-type="reset" @click="reset">重置</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import { fetchList, saveOrUpdate } from 'api/task';
  import { fetchList as fetchGroupList } from 'api/group';
  import { timeToStamp } from 'utils'

  export default {
    data() {
      return {
        form: {
          id: undefined,
          name: '',
          scriptName: '',
          groupId: 0,
          ownerProjects: '',
          db: '',
          cycle: '',
          referJobIds: [],
          exeTime: '',
          startDate: '',
          endDate: '',
          updateTime: '',   
          status: 0,
          userName  : ''                     
        },
        loading: false,
        referJobIdsOptions: [],
        ownerProjectsOptions: [],
        states: []
      }
    },
    mounted() {
      // this.form.referJobIdsList = this.states.map(item => {
      //   return { value: item, label: item };
      // });
    },
    methods: {
      onSubmit() {
        this.form.referJobIds = this.form.referJobIds.join()
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
                message: '保存失败',
                type: 'error',
                duration: 2000
              });
            }
        })
      },
      onSave() {
        this.form.referJobIds = this.form.referJobIds.join()        
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
                message: '保存失败',
                type: 'error',
                duration: 2000
              });
            }
        })
      },
      getReferJobIds(query) {
        if (query !== '') {
          this.loading = true;
          fetchList({keyword:query,page:1,rows:500}).then(response => {
            this.loading = false;
            if(response.success && response.data.rows) {
              this.states = response.data.rows.map(item => {
                return { value: item.id, label: item.name };
              })
              console.log('states', this.states)
              this.referJobIdsOptions = this.states.filter(item => {
                return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              })
            }
          })
        } else {
          this.referJobIdsOptions = [];
        }
      },
      getOwnerProjects(query) {
        if (query !== '') {
          this.loading = true;
          fetchGroupList({keyword:query,page:1,rows:500}).then(response => {
            this.loading = false;
            if(response.success && response.data.rows) {
              this.states = response.data.rows.map(item => {
                return { value: item.id, label: item.name };
              })
              console.log('states', this.states)
              this.ownerProjectsOptions = this.states.filter(item => {
                return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              })
            }
          })
        } else {
          this.ownerProjectsOptions = [];
        }
      },
      reset() {
        this.form.referJobIds = []
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
