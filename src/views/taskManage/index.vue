<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Job_name" v-model="listQuery.jobName">
      </el-input> 
      <el-input @keyup.enter.native="handleFilter" style="width: 120px;" class="filter-item" placeholder="提交人" v-model="listQuery.author"> 
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-waves icon="circle-close" @click="clearFilter">清除</el-button>
    </div>

    <el-table  :key='tableKey' :data="list" :default-sort="{prop: 'id', order: 'aescending'}" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="Job_id" width="110" sortable prop="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Job_name" sortable prop="jobName">
        <template scope="scope">
          <!--<span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>-->
          <a href='#' >{{scope.row.jobName}}</a>
        </template>
      </el-table-column>

      <el-table-column min-width="130px" label="调度时间点" sortable prop="exeTime">
        <template scope="scope">
          <span>{{scope.row.exeTime | parseTime('{h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" label="所属组ID" sortable prop="groupId">
        <template scope="scope">
          <span>{{scope.row.groupId}}</span>          
        </template>
      </el-table-column>

      <el-table-column min-width="130px" label="所属组名" sortable prop="groupName">
        <template scope="scope">
          <span>{{scope.row.groupName}}</span>          
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="调度开始日期" prop="startDate" sortable>
        <template scope="scope">
          <span>{{scope.row.startDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="调度结束日期" prop="endDate" sortable>
        <template scope="scope">
          <span>{{scope.row.endDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="更新时间" prop="updateTime" sortable>
        <template scope="scope">
          <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {hh}:{mm}:{ss}')}}</span>
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

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>

        <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="Job_name">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>

        <el-form-item label="重要性">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>

        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog :title="textMap[dialogStatus]" v-model="editorDialogVisable">
      <div class="form-container">
          <el-form ref="form" :model="form" label-width="110px" class="form">
          <el-form-item label="任务名称">
            <el-input v-model="form.jobName"></el-input>
          </el-form-item>
          <el-form-item label="任务脚本名">
            <el-input v-model="form.scriptName"></el-input>
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
            <el-input v-model="form.groupName"></el-input>
          </el-form-item>
          <el-form-item label="运行周期">
            <el-select v-model="form.cycle" placeholder="请选择">
              <el-option label="每日" value="daily"></el-option>
              <el-option label="单次" value="once"></el-option>
              <el-option label="每周" value="weekly"></el-option>
              <el-option label="每月" value="monthly"></el-option>
              <el-option label="每年" value="yearly"></el-option>
              <el-option label="每小时" value="hourly"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行时间点">
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.exeTime" format="HH:mm" style="width: 50%;" @change="timeToStamp('exeTime')"></el-time-picker>
          </el-form-item>
          <el-form-item label="首次运行日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.startDate" style="width: 50%;" @change="timeToStamp('startDate')"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="success" >保存</el-button>
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
    import { fetchList } from 'api/task';
    import { parseTime, objectMerge } from 'utils';

    export default {
      name: 'TaskManager',
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
            jobName: '',
            scriptName: '',
            groupId: 0,
            groupName: '',
            db: 'SSA',
            cycle: 'daily',
            depend: [],
            exeTime: '',
            startDate: '',
            endDate: '',
            updateTime: '',   
            status: 'Waiting',
            author: '' 
          },
          importanceOptions: [1, 2, 3],
          sortOptions: [{ label: '按ID升序', key: '+id' }, { label: '按ID降序', key: '-id' }],
          statusOptions: ['Success', 'Running', 'Falled', 'Waiting'],
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          dialogPvVisible: false,
          editorDialogVisable: false,
          pvData: [],
          showAuditor: false,
          tableKey: 0,
          form: {
            id: undefined,
            jobName: '',
            scriptName: '',
            groupId: 0,
            groupName: '',
            db: 'SSA',
            cycle: 'daily',
            depend: [],
            exeTime: '',
            startDate: '',
            endDate: '',
            updateTime: '',   
            status: 'Waiting',
            author: ''                     
          },
          loading: false,
          options: [{
            value: 'HTML',
            label: 'HTML'
          }, {
            value: 'CSS',
            label: 'CSS'
          }, {
            value: 'JavaScript',
            label: 'JavaScript'
          }],
          states: ["HTML","CSS","JavaScript","PHP", "Java", "Ruby",
          "Python", "NodeJS", "C","C++", "C#", "Perl","Swift", "Go", "R", "Object-C",
          "Visual Basic", "SQL", "Scala", "Lua","Dart", "Lisp","Bash"]
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
        getDepend(query) {
          if (query !== '') {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.options = this.form.dependList.filter(item => {
                return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
              });
            }, 200);
          } else {
            this.options = [];
          }
        },
        handleFilter() {
          this.getList();
        },
        clearFilter() {
          this.listQuery.name = ''
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
          this.form.updateTime = new Date().getTime();
          if (!/d+/ig.test(this.form.startDate)) {
            this.form.startDate = this.timeToStamp(this.form.startDate)
          }
          if (!/d+/ig.test(this.form.exeTime)) {
            this.form.exeTime = this.timeToStamp(this.form.exeTime)
          }
          for (const v of this.list) {
            if (v.id === this.form.id) {
              objectMerge(v, this.form);
              break;
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
