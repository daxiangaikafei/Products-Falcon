<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 260px;" class="filter-item" placeholder="任务组名、提交人" v-model="listQuery.keyword">
      </el-input>
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.userName">
      </el-input>-->
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'projectId', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="任务组ID" width="130" sortable prop="projectId">
        <template scope="scope">
          <span>{{scope.row.projectId}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" label="任务组名" sortable prop="name" sortable>
        <template scope="scope">
          <a href='#' >{{scope.row.name}}</a>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建日期" prop="createTime" sortable>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="失效日期" prop="endDate" sortable>
        <template scope="scope">
          <span>{{scope.row.endDate}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="更新时间" prop="updateTime" sortable>
        <template scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="220px" label="组描述" show-overflow-tooltip prop="describe">
        <template scope="scope" >
          <!--<el-popover
            title="组描述"
            placement="left"
            width="230"
            trigger="hover"
            :content="scope.row.describe">-->
            <!--<span class="line-more" slot="reference" >-->
            {{scope.row.describe}}
            <!--</span>-->
          <!--</el-popover>-->
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" sortable prop="status"
        :filters="[{ text: 'Success', value: 0 }, { text: 'Falled', value: 1 }, { text: 'Running', value: 2 }, { text: 'Waiting', value: 3 }]"
        :filter-method="showStatusFilter"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="提交人" sortable prop="userName">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作" width="80">
        <template scope="scope">
          <el-button v-if="scope.row.status==2" size="small" type="danger" @click="handleModifyStatus(scope.row, 1)">停止
          </el-button>
          <el-button v-if="scope.row.status!=2" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" v-model="editorDialogVisable">
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
              <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" format="yyyy-MM-dd" style="width: 50%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="调度结束日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" format="yyyy-MM-dd" style="width: 50%;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="update" >保存</el-button>
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
    import { fetchList, queryProjectInfo, saveOrUpdate, run, stop } from 'api/group';
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
            rows: 20,
            keyword: ''
          },
          temp: {
            projectId: undefined,
            name: '',
            userName: '',
            dataLevel: '',
            describe: '',
            status: '',
            beginDate: '',
            endDate: '',       
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
            if (response.success) {
              this.list = response.data.rows.map(obj=>{
                obj.endDate = parseTime(new Date(obj.endDate));
                return obj;
              });
              this.total = response.data.pageCount;
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
          stop(2, row.projectId+'').then(response => {
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
          queryProjectInfo(row.projectId).then(response => {
            if (response.success) {
              objectMerge(this.form, response.data)
              objectMerge(this.temp, this.form)

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
          run(this.form.projectId).then(response => {
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
