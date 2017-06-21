<template>
  <div class="log-container" :style="{height:cHeight+'px'}">
    <TaskMenu></TaskMenu>
    <div class="title">当前执行日志：P_SEITL_TASK_KGN_G</div>
     <div class="log">
       {{log.content}}
    </div>

  </div>
</template>
<script>
  import { fetchLog } from 'api/log';
  import TaskMenu from './taskMenu'

  export default {
    components: {
      TaskMenu
    },
    data() {
      return {
        listQuery: {
          wfJobName:undefined
        },
        log: '',
        cHeight: 0
      }
    },
    created() {
      this.getLog()
      this.cHeight = window.innerHeight - 100
      this.listQuery.wfJobName = this.$route.params.taskId      
    },
    mounted() {
    },
    methods: {
      getLog() {
        this.listLoading = true;
        fetchLog(this.listQuery).then(response => {
          if (response.success) {
            this.log = response.data;
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
      back() {
        this.$router.go(-1)
      }
    }
  };
</script>
<style lang="scss" scope>
  .log-container {
    width: 100%;
    height: 100%;
    min-width: 500px;
    padding: 20px;
    box-sizing: border-box;
    .title {
      margin-bottom: 20px;
      font-size: 14px;
    }
    .log {
      background: #fff;
      padding: 15px;
      height: 100%;
      line-height: 2;
      overflow-y: scroll;
    }
  }
</style>


