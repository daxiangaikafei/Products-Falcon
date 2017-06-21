<template>
  <div class="app-container calendar-list-container">
    <TaskMenu />
      <div class='chart-container'>
        <durationLine height='100%' width='100%' :options="chartOptions" />
      </div>
    <el-table 
      ref="listTable"
      :key='tableKey' 
      :data="list" 
      :default-sort="{prop: 'id', order: 'aescending'}" 
      v-loading.body="listLoading" 
      border fit highlight-current-row 
      style="width: 100%">
      <el-table-column align="center" label="ID" width="300" sortable prop="wfJobId">
        <template scope="scope">
          <span>{{scope.row.wfJobId}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="240px" label="Job_name" sortable prop="wfJobName" sortable>
        <template scope="scope">
          <span >{{scope.row.wfJobName}}</span>
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
        :filters="[{ text: 'Success', value: 0 }, { text: 'Falled', value: 1 }, { text: 'Running', value: 2 }, { text: 'Waiting', value: 3 }]" 
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

      <!--<el-table-column width="110px" align="center" label="日志">
        <template scope="scope">
          <router-link :to="{name:'Log',params: {taskId: scope.row.id}}">
            <el-button type="success" size="small">查看</el-button>
          </router-link>
        </template>
      </el-table-column>-->
    </el-table>

    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

  </div>
</template>

<script>
    import { queryRunMapList } from 'api/task';
    import { parseTime, objectMerge } from 'utils';
    import durationLine from './durationLine';
    import TaskMenu from './taskMenu'

    export default {
      name: 'durationView',
      components: { durationLine, TaskMenu },      
      data() {
        return {
          wfJobName: undefined,
          list: [],
          total: null,
          listLoading: true,
          displayDays: 'all',
          displayStatus: ['Success', 'Running', 'Falled', 'Waiting'],
          selection: [],
          listQuery: {
            // page: 1,
            // rows: 10,
            wfJobName: ''
          },
          temp: {
            jobId: undefined,
            wfJobId: '',
            wfJobName: '',
            userName: '',
            startTime: '',
            endTime: '',
            runTime: '',
            status: ''
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
            jobId: undefined,
            wfJobId: '',
            wfJobName: '',
            userName: '',
            startTime: '',
            endTime: '',
            runTime: '',
            status: ''              
          },
          loading: false,
          chartOptions: {
            backgroundColor: '#fff',
            title: {
              text: '当前查看任务',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                color: '#57617B'
              },
              padding: [10,0,10,10]
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                lineStyle: {
                  color: '#57617B'
                }
              }
            },
            grid: {
              left: '2%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: '#DFE0E1'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#57617B',
                  fontSize: 14                                    
                }
              },
              offset: 3,
              data: []
            }],
            yAxis: [{
              type: 'value',
              name: '单位(s)',
              axisTick: {
                show: false
              },
              nameTextStyle: {
                color: '#57617B'                                  
              },
              axisLine: {
                lineStyle: {
                  color: '#DFE0E1'
                }
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  color: '#57617B',                  
                  fontSize: 14
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#DFE0E1'
                }
              }
            }],
            series: [{
              name: 'Duration',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 4,
              showSymbol: true,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: '#B7F1D3',
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 3
                }
              },
              itemStyle: {
                normal: {
                  color: '#25CF6C',
                  borderColor: '#25CF6C',
                  borderWidth: 2

                }
              },
              data: []
            }]
          }
        }
      },
      
      created() {
        this.wfJobName = this.$route.params.taskId
        this.listQuery.wfJobName = this.wfJobName
        this.getList();
        
      },
      updated() {
        // if(this.list && this.list[0]) {
        //   this.toggleSelection(this.list[0])
        // }
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            succeeded: 'success',
            running: 'primary',
            killed: 'danger',
            waiting: 'warning'
          };
          return statusMap[status.toLowerCase()]
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
      watch: {
        
      },
      methods: {
        getList() {
          this.listLoading = true;
          queryRunMapList(this.listQuery).then(response => {
            this.list = response.data;
            // this.total = response.data;
            let dates = [],
                durations = []
            this.list.forEach(item => {
              dates.push(item.startTime.split(' ')[0])
              durations.push(item.runSeconds)
            })
            // debugger
            this.chartOptions.xAxis[0].data = dates
            this.chartOptions.series[0].data = durations
            this.chartOptions.title.text = '当前查看任务： '+this.wfJobName
            this.listLoading = false;
          })
        },
        handleFilter() {
          this.getList();
        },
        // clearFilter() {
        //   this.listQuery.groupName = ''
        //   this.listQuery.userName = ''
        //   this.getList();
        // },
        // toggleSelection(row) {
        //   if(row) {
        //     this.$refs.listTable.setCurrentRow(row)
        //     this.handleRowClick(row)
        //   }
        // },
        handleSelectionChange(val) {
          this.selection = val
        },
        // handleSizeChange(val) {
        //   this.listQuery.rows = val;
        //   this.getList();
        // },
        // handleCurrentChange(val) {
        //   this.listQuery.page = val;
        //   this.getList();
        // },
        // handleSortChange() {
        //   this.$refs.listTable.setCurrentRow()
        // },
        // handleRowClick(row) {
        //   this.chartOptions.xAxis[0].data = row.dates
        //   this.chartOptions.series[0].data = row.durations
        //   this.chartOptions.title.text = '当前查看任务： '+row.name
        // },
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

  .chart-container{
    width: 100%;
    height: 45vh;
    margin-bottom: 10px;
}
</style>
