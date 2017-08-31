<template>
  <div class="form-container">
    <el-form ref="form" :model="form" label-width="110px" class="form">
    <el-form-item label="任务名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="任务脚本名">
      <el-input v-model="form.shellName"></el-input>
    </el-form-item>
    <el-form-item label="操作人">
      <el-input v-model="form.userName  "></el-input>
    </el-form-item>
    <el-form-item label="数据库仓库层级">
      <el-select v-model="form.dataLevel" placeholder="请选择">
        <el-option label="SSA" value="SSA"></el-option>
        <el-option label="SOR" value="SOR"></el-option>
        <el-option label="DPA" value="DPA"></el-option>
        <el-option label="DM" value="DM"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="依赖任务">
      <!--<el-col :span="21">-->
      <!--<el-input v-model="form.referIds"></el-input>-->
      <el-select
          v-model="referIdsValue"
          multiple
          filterable
          remote
          @change="handleReferIds"
          placeholder="查询并选择依赖"
          :remote-method="getReferIds"
          :loading="loading"
          style="width:100%">
        <el-option
          v-for="item in referIdsOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
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
        <el-button type="text" v-popover:popover4><Icon :icon-name="'plus-circle'" :size="18" ></Icon></el-button>
        </el-col>-->
    </el-form-item>
    <el-form-item label="所属组">
     <el-select
        v-model="ownerProjectValue"
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
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="运行周期">
      <el-cascader 
        change-on-select 
        clearable
        @change="handleCycle"
        :options="cycleOption" 
        v-model="cycleValue" 
        popper-class="refer-pop"
        placeholder="请选择">
      </el-cascader>
    </el-form-item>
    <el-form-item label="运行时间点">
      <el-time-picker type="fixed-time" placeholder="选择时间" v-model="startTimeValue" format="HH:mm" style="width: 50%;"></el-time-picker>
    </el-form-item>
    <!--<el-form-item label="首次运行日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="form.startDate" style="width: 50%;" @change="timeHandler('startDate')"></el-date-picker>
    </el-form-item>-->
    <el-form-item>
      <el-button type="success" @click="save" >保存</el-button>
      <el-button type="primary" @click="commit">提交</el-button>
      <el-button type="warning" native-type="reset" @click="reset">重置</el-button>
      <!--<el-button>取消</el-button>-->
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import { fetchList, run, saveOrUpdate } from 'api/task';
  import { fetchList as fetchGroupList } from 'api/group';
  import { timeToStamp, parseTime } from 'utils'

  export default {
    data() {
      return {
        form: {
          jobId: undefined,
          name: '',
          shellName: '',
          ownerProject: {},
          dataLevel: '',
          cycle: 0,
          referIds: '',
          startTime: '',
          field1: '',
          field2: ''                     
        },
        loading: false,
        referIdsOptions: [],
        referIdsValue: [],        
        ownerProjectsOptions: [],
        states: [],
        ownerProjectValue: {},
        startTimeValue: '',
        cycleValue: [],
        cycleOption: [
          {
            value: 3,
            label: '每日'
          },
          {
            value: 4,
            label: '每周'
          },
          {
            value: 5,
            label: '每月',
            children: (() => {
              let list = []
              for(let h = 1; h <= 31; h++) {
                list.push({
                  value: h,
                  label: `${h}日`
                })
              }
              return list
            })()
          },
          {
            value: 6,
            label: '每年',
            children: (() => {
              let list = []
              for(let h = 1; h <= 12; h++) {
                list.push({
                  value: h,
                  label: `${h}月`,
                  children: (() => {
                    let list = []
                    for(let h = 1; h <= 31; h++) {
                      list.push({
                        value: h,
                        label: `${h}日`
                      })
                    }
                    return list
                  })()
                })
              }
              return list
            })()
          },
          {
            value: 2,
            label: '小时',
            children: (() => {
              let list = []
              for(let h = 1; h < 24; h++) {
                list.push({
                  value: h,
                  label: `每${h}小时`
                })
              }
              return list
            })()
          },
          {
            value: 1,
            label: '分钟',
            children: (() => {
              let list = []
              for(let h = 1; h < 60; h++) {
                list.push({
                  value: h,
                  label: `每${h}分钟`
                })
              }
              return list
            })()
          },
        ]
      }
    },
    mounted() {
      // this.form.referIdsList = this.states.map(item => {
      //   return { value: item, label: item };
      // });
    },
    methods: {
      commit() {
        run(this.form.jobId).then(response => {
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
        this.form.ownerProject = this.ownerProjectValue
        this.form.startTime = parseTime(this.startTimeValue, '{h}:{i}')
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
            this.form.jobId = response.data
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.form.ownerProject = this.ownerProjectValue.name   
            this.$notify({
              title: '失败',
              message: response.message,
              type: 'error',
              duration: 2000
            });
          }
        })
      },
      getReferIds(query) {
        if (query && query !== '') {
          this.loading = true;
          fetchList({keyword:query,page:1,rows:500}).then(response => {
            this.loading = false;
            if(response.success && response.data.rows) {
              this.states = response.data.rows.map(item => {
                return { id: item.id, name: item.name };
              })
              this.referIdsOptions = this.states.filter(item => {
                return item.name.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              })
              this.states = []
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
          this.referIdsOptions = [];
        }
      },
      getOwnerProjects(query) {
        if (query && query !== '') {
          this.loading = true;
          fetchGroupList({keyword:query,page:1,rows:500}).then(response => {
            this.loading = false;
            if(response.success && response.data.rows) {
              this.states = response.data.rows.map(item => {
                return { id: item.projectId, name: item.name };
              })
              this.ownerProjectsOptions = this.states.filter(item => {
                return item.name.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              })
              this.states = []              
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          this.ownerProjectsOptions = [];
        }
      },
      handleCycle() {
        this.form.cycle = this.cycleValue[0]
        this.form.field1 = this.cycleValue[1]
        this.form.field2 = this.cycleValue[2]
      },
      handleReferIds() {
        this.form.referIds = this.referIdsValue.join()
      },
      reset() {
        this.referIdsValue = []
        this.cycleValue = []
      },
      timeHandler(key) {
        timeToStamp(key, this.form)
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .form-container {
      @include flex;
      @include flex-justify;
      padding: 20px;
      .form {
        width: 500px;
      }
  }
  .refer-pop {
    height: 230px;
  }
</style>
