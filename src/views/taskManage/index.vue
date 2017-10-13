<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 260px;" class="filter-item" placeholder="Job名称、提交人" v-model="listQuery.keyword">
      </el-input> 
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.userName"> 
      </el-input>-->
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'id', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Job_Id" width="110" sortable prop="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Job名称" sortable prop="name">
        <template scope="scope">
          <!--<span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>-->
          <a href='#' >{{scope.row.name}}</a>
        </template>
      </el-table-column>

      <el-table-column min-width="130px" align="center" label="调度时间点" sortable prop="startTime">
        <template scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="90px" align="center" label="组ID" sortable prop="ownerProjectId">
        <template scope="scope">
          <span>{{scope.row.ownerProjectId}}</span>          
        </template>
      </el-table-column>

      <el-table-column min-width="130px" label="所属组名" show-overflow-tooltip sortable prop="ownerProjectName">
        <template scope="scope">
          <span>{{scope.row.ownerProjectName}}</span>          
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" show-overflow-tooltip label="调度开始日期" prop="startDate" sortable>
        <template scope="scope">
          <span>{{scope.row.startDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="调度结束日期" prop="endDate" sortable>
        <template scope="scope">
          <span>{{scope.row.endDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="创建时间" prop="createTime" sortable>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="更新时间" prop="updateTime" sortable>
        <template scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column class-name="status-col" label="Status" width="110" sortable prop="status"
        :filters="[{ text: 'Success', value: 0 }, { text: 'Killed', value: 1 }, { text: 'Running', value: 2 }]" 
        :filter-method="showStatusFilter"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusTextFilter}}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column width="110px" align="center" label="提交人" sortable prop="userName">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作" width="80">
        <template scope="scope">
          <el-button v-if="scope.row.status==2" size="small" type="danger" @click="handleModifyStatus(scope.row,1)">停止
          </el-button>
          <el-button v-if="scope.row.status!=2" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]"
        :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="编辑" v-model="editorDialogVisable">
      <div class="form-container">
          <el-form ref="form" :model="form" label-width="110px" class="form">
          <el-form-item label="任务名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="任务脚本名">
            <el-input v-model="form.shellName"></el-input>
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
          <el-form-item label="依赖任务">
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
            <el-button type="success" @click="update">保存</el-button>
            <el-button type="primary" @click="commit">提交</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
            <el-button @click="editorDialogVisable = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, run, stop, saveOrUpdate, queryJobInfo } from 'api/task';
  import { fetchList as fetchGroupList } from 'api/group';
  import { parseTime, objectMerge, timeToStamp } from 'utils';

  export default {
    name: 'TaskManager',
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          rows: 20,
          keyword: ''
        },
        temp: {
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
        dialogStatus: '',
        dialogPvVisible: false,
        editorDialogVisable: false,
        tableKey: 0,
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
        ownerProjectValue: [],
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
    
    created() {
      this.getList();
    },
    mounted() {
    },
    filters: {
      statusFilter(status) {
        const statusMap = [
          'success',
          'primary',
          'danger'
        ];
        return statusMap[status]
      },
      statusTextFilter(status) {
        const statusMap = [
          'Success',
          'Killed',
          'Running'
        ];
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          if (response.success) {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          } else {
            this.$notify({
              title: '失败',
              message: response.message,
              type: 'error',
              duration: 2000
            })
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
        } else {
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
                return { id: item.id, name: item.name };
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
      handleFilter() {
        this.getList();
      },
      clearFilter() {
        this.listQuery.keyword = ''
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.rows = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      timeFilter(time) {
        if (!time[0]) {
          this.listQuery.start = undefined;
          this.listQuery.end = undefined;
          return;
        }
        this.listQuery.start = parseInt(+time[0] / 1000);
        this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
      },
      handleModifyStatus(row, status) {
        this.loading = true;
        stop(2, row.id+'').then(response => {
          this.loading = false;
          if (response.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            row.status = status;
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
        })    
      },
      handleUpdate(row) {
        queryJobInfo(row.id).then(response => {
          if (response.success) {
            objectMerge(this.form, response.data)
            objectMerge(this.temp, this.form)
            this.ownerProjectsOptions.push(this.form.ownerProject)
            this.ownerProjectValue = this.form.ownerProject.id
            this.cycleValue = [this.form.cycle,+this.form.field1,+this.form.field2]
            this.referIdsOptions = this.form.referIds
            this.referIdsValue = this.form.referIds.map(item => item.id)
            /**addby zhao */
            this.form.referIds = this.referIdsValue.join();
            /**end changed**/
            this.startTimeValue = +new Date('1 '+this.form.startTime)

            this.dialogStatus = 'update';
            this.editorDialogVisable = true;
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
      update() {
        this.form.ownerProject = this.ownerProjectValue;
        this.form.startTime = parseTime(this.startTimeValue, '{h}:{i}')
        // for (let v of this.list) {
        //   if (v.id === this.form.id) {
        //     objectMerge(v, this.form)
        //     break
        //   }
        // }
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
            // this.editorDialogVisable = false
            this.getList()
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
      commit() {
        run(this.form.jobId).then(response => {
          if (response.success) {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            });
            this.editorDialogVisable = false;   
            this.getList()            
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
        objectMerge(this.form, this.temp)          
      },
      showStatusFilter(value, row) {
        return row.status === value
      },
      handleCycle() {
        this.form.cycle = this.cycleValue[0]
        this.form.field1 = this.cycleValue[1]
        this.form.field2 = this.cycleValue[2]
      },
      handleReferIds() {
        this.form.referIds = this.referIdsValue.join()
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
