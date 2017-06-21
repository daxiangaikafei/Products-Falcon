<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 260px;" class="filter-item" placeholder="Job_name、提交人" v-model="listQuery.keyword">
      </el-input> 
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.userName"> 
      </el-input>-->
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'id', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Job_id" width="110" sortable prop="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Job_name" sortable prop="name">
        <template scope="scope">
          <!--<span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>-->
          <a href='#' >{{scope.row.name}}</a>
        </template>
      </el-table-column>

      <el-table-column min-width="130px" label="调度时间点" sortable prop="startTime">
        <template scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" label="所属组ID" sortable prop="ownerProjectId">
        <template scope="scope">
          <span>{{scope.row.ownerProjectId}}</span>          
        </template>
      </el-table-column>

      <el-table-column min-width="130px" label="所属组名" sortable prop="ownerProjectName">
        <template scope="scope">
          <span>{{scope.row.ownerProjectName}}</span>          
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="调度开始日期" prop="startDate" sortable>
        <template scope="scope">
          <span>{{scope.row.startDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="调度结束日期" prop="endDate" sortable>
        <template scope="scope">
          <span>{{scope.row.endDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="更新时间" prop="updateTime" sortable>
        <template scope="scope">
          <span>{{scope.row.updateTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" sortable prop="status"
        :filters="[{ text: 'Success', value: 0 }, { text: 'Falled', value: 1 }, { text: 'Running', value: 2 }, { text: 'Waiting', value: 3 }]" 
        :filter-method="showStatusFilter"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusTextFilter}}</el-tag>
        </template>
      </el-table-column>

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

    <el-dialog :title="textMap[dialogStatus]" v-model="editorDialogVisable">
      <div class="form-container">
          <el-form ref="form" :model="form" label-width="110px" class="form">
          <el-form-item label="任务名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="任务脚本名">
            <el-input v-model="form.scriptName"></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input v-model="form.userName"></el-input>
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
            <el-select
                v-model="form.depend"
                multiple
                filterable
                remote
                placeholder="查询并选择依赖"
                :remote-method="getDepend"
                :loading="loading"
                style="width:100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="所属组">
            <el-input v-model="form.ownerProjectName"></el-input>
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
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.startTime" format="HH:mm" style="width: 50%;" @change="timeHandler('startTime')"></el-time-picker>
          </el-form-item>
          <el-form-item label="首次运行日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startDate" style="width: 50%;" @change="timeHandler('startDate')"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="update">保存</el-button>
            <el-button type="primary" @click="commit">提交</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
            <el-button @click="editorDialogVisable = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, stop, saveOrUpdate, queryJobInfo } from 'api/task';
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
          id: undefined,
          name: '',
          shellName: '',
          ownerProjectId: 0,
          ownerProject: '',
          dataLevel: 'SSA',
          cycle: '',
          referIds: [],
          startTime: '',
          startDate: '',
          endDate: '',
          updateTime: '',   
          status: 0,
          userName: '' 
        },
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        editorDialogVisable: false,
        tableKey: 0,
        form: {
          id: undefined,
          name: '',
          shellName: '',
          ownerProjectId: 0,
          ownerProject: '',
          dataLevel: 'SSA',
          cycle: 'daily',
          depend: [],
          startTime: '',
          startDate: '',
          endDate: '',
          updateTime: '',   
          status: 'Waiting',
          userName: ''                     
        },
        loading: false,
        referIdsOptions: [],
        ownerProjectsOptions: [],
        states: []
      }
    },
    
    created() {
      this.getList();
    },
    mounted() {
      this.form.dependList = this.states.map(item => {
        return { value: item, label: item };
      });
    },
    filters: {
      statusFilter(status) {
        const statusMap = [
          'success',
          'primary',
          'danger',
          'warning'
        ];
        return statusMap[status]
      },
      statusTextFilter(status) {
        const statusMap = [
          'Success',
          'Falled',
          'Running',
          'Waiting'
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
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
      },
      getReferIds(query) {
        if (query !== '') {
          this.loading = true;
          fetchList({keyword:query,page:1,rows:500}).then(response => {
            this.loading = false;
            if(response.success && response.data.rows) {
              this.states = response.data.rows.map(item => {
                return { value: item.id, label: item.name };
              })
              this.referIdsOptions = this.states.filter(item => {
                return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              })
            }
          })
        } else {
          this.referIdsOptions = [];
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
              message: '操作失败',
              type: 'error'
            })
          }
        })
        
      },
      handleUpdate(row) {
        queryJobInfo(row.id).then(response => {
          objectMerge(this.form, response.data)
          objectMerge(this.temp, this.form)
          this.dialogStatus = 'update';
          this.editorDialogVisable = true;
        })   
      },
      update() {
        this.form.referIds = this.form.referIds.join()
        this.form.updateTime = parseTime(new Date())
        for (let v of this.list) {
          if (v.id === this.form.id) {
            objectMerge(v, this.form)
            break
          }
        }
        this.editorDialogVisable = false;
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            });
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
      commit() {
        this.editorDialogVisable = false;
        saveOrUpdate(this.form).then(response => {
          if (response.success) {
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            });
          } else {
            this.$notify({
              title: '失败',
              message: '提交失败',
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
