<template>
  <div class="log-container" :style="{height:cHeight+'px'}">

    <div class="title"><el-button size="small" icon="arrow-left" @click="back">返回</el-button> 日志</div>
     <div class="log">
       {{log.content}}
    </div>

  </div>
</template>
<script>
  import { fetchLog } from 'api/log';

  export default {
    data() {
      return {
        listQuery: {
          id:undefined
        },
        log: '',
        cHeight: 0
      }
    },
    created() {
      this.getLog()
      this.cHeight = window.innerHeight - 100
      this.listQuery.id = this.$route.params.taskId      
    },
    mounted() {
    },
    methods: {
      getLog() {
        this.listLoading = true;
        fetchLog(this.listQuery).then(response => {
          this.log = response.items;
          this.listLoading = false;
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


