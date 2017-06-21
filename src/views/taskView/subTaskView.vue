<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 260px;" class="filter-item" placeholder="Job名称、提交人" v-model="listQuery.keyword">
      </el-input> 
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.userName"> 
      </el-input>-->
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
      <span class="filter-item" style="margin-left:12px;font-size:14px">展示天数：</span>
      <el-radio-group v-model="listQuery.days" size="small" class="filter-item" @change="handleDaysChange">
        <el-radio-button v-for="status in dayOptions" :label="status.value" :key="status.value">{{status.label}}</el-radio-button>
      </el-radio-group>
      <span class="filter-item" style="margin-left:12px;font-size:14px">Status：</span>
      <el-radio-group v-model="listQuery.status" size="small" class="filter-item" @change="handleStatusChange">
        <el-radio-button v-for="status in statusOptions" :label="status.value" :key="status.value">{{status.label}}</el-radio-button>
      </el-radio-group>
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'wfJobId', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="330" sortable prop="wfJobId">
        <template scope="scope">
          <span>{{scope.row.wfJobId}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="240px" label="Job名称" sortable prop="wfJobName" sortable>
        <template scope="scope">
          <router-link class="link" :to="{name:'Tree',params: {taskId: scope.row.jobId, wfId: scope.row.wfJobName}}">
            {{scope.row.wfJobName}}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="开始时间" prop="startTime" sortable>
        <template scope="scope">
          <span>{{scope.row.startTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="结束时间" prop="endTime" sortable>
        <template scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="运行时长" prop="runTime" sortable>
        <template scope="scope">
          <span>{{scope.row.runTime}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" sortable prop="status"
        :filter-method="showStatusFilter"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="提交人" sortable prop="userName">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    
  </div>
</template>

<script>
    import { queryWfJobsList } from 'api/task';
    import { parseTime, objectMerge } from 'utils';

    export default {
      name: 'subTaskView',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            rows: 20,
            status: '',
            days: ''
          },
          temp: {
            wfJobId: undefined,
            wfJobName: '',
            userName: '',
            startTime: '',
            endTime: '',
            updateTime: '',
            runTime: '',
            status: 'Waiting'
          },
          importanceOptions: [1, 2, 3],
          statusOptions: [
            {
              label:'Succeeded',
              value:'SUCCEEDED'
            },
            {
              label:'Running',
              value:'RUNNING'
            },
            {
              label:'Killed',
              value:'KILLED'
            },
            {
              label:'All',
              value:''
            }
          ],
          dayOptions: [
            {
              label:'1',
              value:1
            },
            {
              label:'7',
              value:7
            },
            {
              label:'15',
              value:15
            },
            {
              label:'30',
              value:30
            },
            {
              label:'All',
              value:''
            }
          ],
          dialogStatus: '',
          editorDialogVisable: false,
          showAuditor: false,
          tableKey: 0,
          form: {
            wfJobId: undefined,
            wfJobName: '',
            userName: '',
            startTime: '',
            endTime: '',
            updateTime: '',
            runTime: '',
            status: 'Waiting'                  
          },
          loading: false
        }
      },
      
      created() {
        this.getList();
      },
      mounted() {
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            succeeded: 'success',
            running: 'primary',
            killed: 'danger',
          };
          return statusMap[status.toLowerCase()]
        },
        typeFilter(type) {
          return calendarTypeKeyValue[type]
        }
      },
      
      methods: {
        getList() {
          this.listLoading = true;
          queryWfJobsList(this.listQuery).then(response => {
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
        handleStatusChange(val) {
          this.getList();
        },
        handleDaysChange(val) {
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
        showStatusFilter(value, row) {
          return row.status === value
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
  .line-more {
    @include text-line-feed(1);
  }
  .link {
    color: #20a0ff;
  }
</style>
