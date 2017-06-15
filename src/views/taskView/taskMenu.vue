<template>
  <el-button-group>
    <el-button size="small" :type="getActive('Tree')" @click="link({name:'Tree',params: {taskId: id}})">
      <!--<Icon icon-name="share" :size="12" />-->
      树形血缘图
    </el-button>
    <el-button size="small" :type="getActive('Dutration')" @click="link({name:'Dutration',params: {taskId: id}})">调度执行时间</el-button>
    <el-button size="small" :type="getActive('Log')" @click="link({name:'Log',params: {taskId: id}})">执行日志</el-button>
  </el-button-group>
</template>
<script>
  export default {
    name: 'TaskMenu',
    data() {
      return {
        taskId: undefined
      }
    },
    created() {
      this.id = this.$route.params.taskId
    },
    methods: {
      link(to) {
        this.$router.push(to)
      },
      getActive(name) {
        return this.$route.name == name ? 'primary' : ''
      }
    }
  }
</script>
<style>
  .el-button-group {
    display: block;
    margin: 0 0 20px 0;
  }
</style>
