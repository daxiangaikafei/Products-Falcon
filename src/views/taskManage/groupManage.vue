<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="任务组名" v-model="listQuery.groupName">
      </el-input> 
      <el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.author"> 
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'id', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="任务组ID" width="130" sortable prop="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" label="任务组名" sortable prop="groupName" sortable>
        <template scope="scope">
          <a href='#' >{{scope.row.groupName}}</a>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建日期" prop="createDate" sortable>
        <template scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="失效日期" prop="loseDate" sortable>
        <template scope="scope">
          <span>{{scope.row.loseDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="更新时间" prop="updateTime" sortable>
        <template scope="scope">
          <span>{{scope.row.updateTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="220px" label="组描述" show-overflow-tooltip prop="groupDesc">
        <template scope="scope" >
          <!--<el-popover
            title="组描述"
            placement="left"
            width="230"
            trigger="hover"
            :content="scope.row.groupDesc">-->
            <span class="line-more" slot="reference" >{{scope.row.groupDesc}}</span>          
          <!--</el-popover>-->
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

      <el-table-column  align="center" label="操作" width="80">
        <template scope="scope">
          <el-button v-if="scope.row.status=='Running'" size="small" type="danger" @click="handleModifyStatus(scope.row,'Falled')">停止
          </el-button>
          <el-button v-if="scope.row.status!='Running'" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" v-model="editorDialogVisable">
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
              <el-date-picker type="date" placeholder="选择日期" v-model="form.createDate" style="width: 50%;" @change="timeHandler('createDate')"></el-date-picker>
          </el-form-item>
          <el-form-item label="调度结束日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.loseDate" style="width: 50%;" @change="timeHandler('loseDate')"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <!--<el-button type="success" >保存</el-button>-->
            <el-button type="primary" @click="update">提交</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
            <el-button @click="editorDialogVisable = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import { fetchList } from 'api/group';
    import { parseTime, objectMerge, timeToStamp } from 'utils';

    export default {
      name: 'GroupManager',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
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
            groupName: '',
            author: '',
            createDate: '',
            db: 'SSA',            
            loseDate: '',
            updateTime: '',
            groupDesc: '',
            status: 'Waiting'
          },
          importanceOptions: [1, 2, 3],
          statusOptions: ['Success', 'Running', 'Falled', 'Waiting'],
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          editorDialogVisable: false,
          showAuditor: false,
          tableKey: 0,
          form: {
            id: undefined,
            groupName: '',
            author: '',
            db: 'SSA',
            createDate: '',
            loseDate: '',
            groupDesc: '',            
            updateTime: '',     
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
          fetchList(this.listQuery).then(response => {
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
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
        },
        handleUpdate(row) {
          objectMerge(this.form, row)
          objectMerge(this.temp, this.form)
          this.dialogStatus = 'update';
          this.editorDialogVisable = true;
        },

        update() {
          this.form.updateTime = +new Date()

          for (let v of this.list) {
            if (v.id === this.form.id) {
              objectMerge(v, this.form)
              break
            }
          }
          this.editorDialogVisable = false;
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
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
  // .line-more {
  //   @include text-line-feed(1);
  // }
</style>
