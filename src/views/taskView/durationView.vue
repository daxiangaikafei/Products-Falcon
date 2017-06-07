<template>
  <div class="app-container calendar-list-container">
      <div class='chart-container'>
        <durationLine height='100%' width='100%' :options="chartOptions" />
      </div>
    <el-table 
      ref="listTable"
      :key='tableKey' 
      :data="list" 
      :default-sort="{prop: 'id', order: 'aescending'}" 
      @row-click="handleRowClick" 
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      v-loading.body="listLoading" 
      border fit highlight-current-row 
      style="width: 100%">
      <el-table-column align="center" label="ID" width="130" sortable prop="id">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" label="Job_name" sortable prop="jobName" sortable>
        <template scope="scope">
          <span >{{scope.row.jobName}}</span>
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

      <el-table-column width="110px" align="center" label="日志">
        <template scope="scope">
          <router-link :to="{name:'Log',params: {taskId: scope.row.id}}">
            <el-button type="success" size="small">查看</el-button>
          </router-link>
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
    import durationLine from './durationLine';

    export default {
      name: 'durationView',
      components: { durationLine },      
      data() {
        return {
          list: [],
          total: null,
          listLoading: true,
          displayDays: 'all',
          displayStatus: ['Success', 'Running', 'Falled', 'Waiting'],
          selection: [],
          listQuery: {
            page: 1,
            limit: 10,
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
          textMap: {
            update: '编辑',
            create: '创建'
          },
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
        this.getList();
        
      },
      updated() {
        if(this.list && this.list[0]) {
          this.toggleSelection(this.list[0])
        }
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
      watch: {
        
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
        toggleSelection(row) {
          if(row) {
            this.$refs.listTable.setCurrentRow(row)
            this.handleRowClick(row)
          }
        },
        handleSelectionChange(val) {
          this.selection = val
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        handleSortChange() {
          this.$refs.listTable.setCurrentRow()
        },
        handleRowClick(row) {
          this.chartOptions.xAxis[0].data = row.dates
          this.chartOptions.series[0].data = row.durations
          this.chartOptions.title.text = '当前查看任务： '+row.jobName
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

  .chart-container{
    width: 100%;
    height: 45vh;
    margin-bottom: 10px;
}
</style>
