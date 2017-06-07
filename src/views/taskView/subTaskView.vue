<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Job_name" v-model="listQuery.jobName">
      </el-input> 
      <el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.author"> 
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
      <span class="filter-item" style="margin-left:12px;font-size:14px">展示天数：</span>
      <el-radio-group v-model="displayDays" size="small" class="filter-item">
        <el-radio-button label="1"></el-radio-button>
        <el-radio-button label="7"></el-radio-button>
        <el-radio-button label="15"></el-radio-button>
        <el-radio-button label="30"></el-radio-button>
        <el-radio-button label="all"></el-radio-button>
      </el-radio-group>
      <!--<span class="filter-item" style="margin-left:12px;font-size:14px">Status：</span>
      <el-checkbox-group v-model="displayStatus" size="small" class="filter-item">
        <el-checkbox-button v-for="status in statusOptions" :label="status" :key="status">{{status}}</el-checkbox-button>
      </el-checkbox-group>-->
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'id', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="130" sortable prop="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" label="Job_name" sortable prop="jobName" sortable>
        <template scope="scope">
          <a href='#' >{{scope.row.jobName}}</a>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="开始时间" prop="startTime" sortable>
        <template scope="scope">
          <span>{{scope.row.startTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="结束时间" prop="endTime" sortable>
        <template scope="scope">
          <span>{{scope.row.endTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="运行时长" prop="exeDuration" sortable>
        <template scope="scope">
          <span>{{scope.row.exeDuration | parseTime('{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" sortable prop="status"
        :filters="[{ text: 'Success', value: 'Success' }, { text: 'Falled', value: 'Falled' }, { text: 'Running', value: 'Running' }, { text: 'Waiting', value: 'Waiting' }]" 
        :filter-method="showStatusFilter"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="提交人" sortable prop="author">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    
  </div>
</template>

<script>
    import { fetchSubTaskList } from 'api/task';
    import { parseTime, objectMerge } from 'utils';

    export default {
      name: 'subTaskView',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          displayDays: 'all',
          displayStatus: ['Success', 'Running', 'Falled', 'Waiting'],
          listQuery: {
            page: 1,
            limit: 20,
            jobName: undefined,
            author: undefined,
            sort: '+id',
            status: ''
          },
          temp: {
            id: undefined,
            jobName: '',
            author: '',
            startTime: '',
            endTime: '',
            updateTime: '',
            exeDuration: '',
            status: 'Waiting'
          },
          importanceOptions: [1, 2, 3],
          statusOptions: ['Success', 'Running', 'Falled', 'Waiting'],
          dialogStatus: '',
          editorDialogVisable: false,
          showAuditor: false,
          tableKey: 0,
          form: {
            id: undefined,
            jobName: '',
            author: '',
            startTime: '',
            endTime: '',
            updateTime: '',
            exeDuration: '',
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
            Success: 'success',
            Running: 'primary',
            Falled: 'danger',
            Waiting: 'warning'
          };
          return statusMap[status]
        },
        typeFilter(type) {
          return calendarTypeKeyValue[type]
        }
      },
      
      methods: {
        getList() {
          this.listLoading = true;
          fetchSubTaskList(this.listQuery).then(response => {
            this.list = response.items;
            this.total = response.total;
            this.listLoading = false;
          })
        },
        handleFilter() {
          this.getList();
        },
        clearFilter() {
          this.listQuery.groupName = ''
          this.listQuery.author = ''
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
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
</style>
