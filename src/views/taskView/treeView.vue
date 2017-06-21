<template>
  <div class="app-container treeview-container">
    <TaskMenu />
    <div class="treeview-nav">
      <p class="treeview-nav-jobName">
        当前查看的任务: <span v-html="navinfo.jobName"></span>
      </p>
      <div class="treeview-nav-btns">
        <el-button v-if="!navinfo.isChecked" type="primary" @click="(navinfo.isChecked = true)" >选定重跑</el-button>
        <div v-if="navinfo.isChecked">
          <el-checkbox v-model="navinfo.checkedAll" @change="checkedAllHandler">全选</el-checkbox>
          <el-button type="primary" >确定</el-button>
          <el-button @click="(navinfo.isChecked = false)" >取消</el-button>
        </div>
      </div>
    </div>
    <svg id="treeChart" version="1.1" @click="svgClickHandler" xmlns="http://www.w3.org/2000/svg" @mouseover="svgOverHandler" @mouseout="svgOutHandler">
      <defs>
      <marker id="arrow"
              markerUnits="strokeWidth"
              markerWidth="12"
              markerHeight="12"
              viewBox="0 0 12 12"
              refX="6"
              refY="6"
              orient="auto">
              <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #324157;" />
      </marker>
      </defs>
      <g transform="translate(0,0)" v-for="(item, index) in trees"  v-bind:transform="'translate(0,' + (index*200) + ')'">
        <g  v-for="(child, childindex) in item"  v-bind:transform="'translate(' + child.x + ',0)'">
          <rect width="200" height="30" data-type="check" v-bind:data-index="index" v-bind:data-childindex="childindex"  v-bind:data-id="child.id"  stroke="#324157" stroke-width="1" v-bind:fill="'' + (child.checked ? '#324157' : '#ffffff') + ''"/>
          <text x="100" y="20" data-type="check" v-bind:data-index="index" v-bind:data-childindex="childindex"  v-bind:data-id="child.id" text-anchor="middle" v-html="child.valueOmit" v-bind:fill="'' + (child.checked ? '#ffffff  ' : '#324157') + ''"></text>

          <g v-if="child.hasChilds " transform="translate(175,0)">
            <g v-if="child.childshow">
              <rect width="20" height="20" data-type="minus" v-bind:data-index="index"  v-bind:data-childindex="childindex"  v-bind:data-id="child.id" x="0" y="5" v-bind:fill="'' + (child.checked ? '#324157  ' : '#ffffff') + ''"/>
              <line data-type="minus" v-bind:data-index="index"  v-bind:data-childindex="childindex"  v-bind:data-id="child.id" v-bind:x1="0" v-bind:y1="15" v-bind:x2="20" v-bind:y2="15" v-bind:stroke="'' + (child.checked ? '#ffffff' : '#324157') + ''" style="stroke-width: 4px;"/>
            </g>
            <g v-if="!child.childshow">
              <rect width="20" height="20" data-type="plus" v-bind:data-childindex="childindex"  v-bind:data-index="index"  v-bind:data-id="child.id" x="0" y="5" v-bind:fill="'' + (child.checked ? '#324157  ' : '#ffffff') + ''"/>
              <line data-type="plus" v-bind:data-index="index"  v-bind:data-childindex="childindex"  v-bind:data-id="child.id" v-bind:x1="0" v-bind:y1="15" v-bind:x2="20" v-bind:y2="15" v-bind:stroke="'' + (child.checked ? '#ffffff' : '#324157') + ''" style="stroke-width: 4px;"/>
              <line data-type="plus" v-bind:data-index="index"  v-bind:data-childindex="childindex"  v-bind:data-id="child.id" v-bind:x1="10" v-bind:y1="5" v-bind:x2="10" v-bind:y2="25" v-bind:stroke="'' + (child.checked ? '#ffffff' : '#324157') + ''" style="stroke-width: 4px;"/>
            </g>
          </g>
        </g>
      </g>
      <path v-for="item in lines" v-bind:d="item.dpoints"  stroke="#324157" fill="none" style="stroke-width: 2px;marker-end: url(#arrow);"></path>
      <!-- <line v-for="item in lines" v-bind:x1="item.x1" v-bind:y1="item.y1" v-bind:x2="item.x2" v-bind:y2="item.y2" style="stroke:rgb(0,0,0);stroke-width:2;marker-end: url(#markerArrow);"/> -->

      <g v-if="tooltip.isShow " id="tooltip" style="pointer-events: none" v-bind:transform="'translate(' + (tooltip.x) + ',' + (tooltip.y+30) + ')'">
        <rect x="0" y="0" v-bind:width="tooltip.w" height="30" style="fill: #4db3ff;"/>
        <text v-bind:x="tooltip.tw" y="20" style="fill: #324157;" text-anchor="middle" v-html="tooltip.value"></text>
      </g>
    </svg>
  </div>
</template>

<script>
    import { queryJobRefer,queryJobInfo,queryReferJob } from 'api/task';
    import { parseTime, objectMerge } from 'utils';
    import TaskMenu from './taskMenu';
    import router from 'router';
    //<line x1="320" y1="30" x2="110" y2="100" style="stroke:rgb(0,0,0);stroke-width:2"/>
    export default {
      name: 'treeView',
      components: {
        TaskMenu
      },
      data() {
        return {
          navinfo:{
            jobName:"",
            isChecked: false,
            checkedAll: false
          },
          tooltip:{
            w: 200,
            x: 0,
            y: 0,
            value: 0,
            isShow: false
          },
          jobQuery: {
            jobId: ''
          },
          trees: [],
          lines: [],
          checkedIds:[],
          treeDatas: [],
          treeHides: [],
          listLoading: false
        }
      },
      created() {
        this.jobQuery.jobId = this.$route.params.taskId
        this.getParentList(this.jobQuery, 0);
      },
      mounted() {
        // this.treeDatasHandler();
      },
      watch: {

      },
      methods: {
        getJobInfo(query){
          //queryJobInfo
          this.listLoading = true;
          queryJobInfo(query).then(response => {
            if(response.success) {
              var _carrs = [];
              _carrs.push({
                id:  String(this.treeDatas.length) + response.data.jobId,
                jobId: response.data.jobId,
                checked: true,
                childshow: false,
                value: response.data.name,
                childs:[],
                hasChilds: !!response.data.hasChilds
              });
              this.checkedIds.push(response.data.jobId);
              this.treeDatas.push(_carrs);
              this.treeDatasHandler();

              this.listLoading = false;
              this.navinfo.jobName = response.data.name;
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
        getParentList(query,index,childindex) {
          this.listLoading = true;
          queryJobRefer(query.jobId).then(response => {
            if (response.success) {
              // console.log(response.data);

              if(response.data && response.data.length >0){
                this.beginDataFormat(response.data,0);
              }
              this.getJobInfo(query.jobId);
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
        getChildList(query,index,childindex) {
          this.listLoading = true;
          queryReferJob(query.jobId).then(response => {
            if (response.success) {
            // console.log(response.data);
            this.beginDataFormat(response.data,index,childindex);
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
        checkRepeat(data, id){
          let _isNoHave = true;
          data.map(function(item,i){
            if(item.jobId === id){
              _isNoHave = false;
            }
          });
          return _isNoHave;
        },
        beginDataFormat(data,index,childindex){
          let _this = this;
          let _isaddchild = false;
          if(this.treeDatas.length === index){
            _isaddchild = true;
          }else{
            _isaddchild = false;
          }
          if(_isaddchild){
            let _carrs = [];
            data.map(function(item,i){
              _carrs.push({
                id: String(index) + item.jobId,
                jobId: item.jobId,
                checked: false,
                childshow: !index,
                value: item.jobName,
                childs: index ? [] : ["1"+_this.jobQuery.jobId],
                hasChilds: item.hasChilds
              });

              if(typeof(childindex)!="undefined"){
                console.log("_this.treeDatas[childindex].childs:" , _this.treeDatas[index-1][childindex] );
                _this.treeDatas[index-1][childindex].childs.push(String(index) + item.jobId);
              }
            });
            this.treeDatas.push(_carrs);
          }else{
            data.map(function(item,i){
              if(_this.checkRepeat(_this.treeDatas[index], item.jobId)){
                let _childobj = {
                  id: String(index) + item.jobId,
                  jobId: item.jobId,
                  checked: false,
                  childshow: false,
                  value: item.jobName,
                  childs:[],
                  hasChilds: item.hasChilds
                };
                if(_this.treeDatas[index].length/2 < childindex){
                  _this.treeDatas[index].push(_childobj);
                }else{
                  _this.treeDatas[index].unshift(_childobj);
                }
              };
              if(typeof(childindex)!="undefined"){
                console.log("_this.treeDatas[childindex].childs:" , _this.treeDatas[index-1][childindex] );
                _this.treeDatas[index-1][childindex].childs.push(String(index) + item.jobId);
              }
            });
          }
          if(index != 0){
            this.treeDatasHandler()
          };
        },
        childsIsHide(items,chid,cIndex){
          let _this = this;
          let ischildshow = false;
          items.map(function(n, i){
            if( n.childs && n.childs.length > 0){
              let _ishave = false;
              if(n.childs.indexOf(chid) <= -1){
                _ishave = false;
              }else{
                _ishave = true;
              }
              if(_ishave){
                if(n.childshow){
                  ischildshow = true;
                }
              }
            }
          });
          if(!ischildshow){
            if(_this.treeHides.indexOf(chid) <= -1){
              _this.treeHides.push(chid);
            }
          }
        },
        treeChildShow2(items,cIndex){
          let _this = this;
          items.map(function(n, i){
            if( n.childs && n.childs.length > 0){

              if(_this.treeHides.indexOf(n.id) > -1){
                n.childshow = false;
              }
              if(!n.childshow){ //子集不显示
                n.childs.map(function(chid, j){
                  _this.childsIsHide(items,chid,cIndex);
                });
              }else{ //子集显示
                // _this.treeAttheIndex2(items);
              }
            }else{
              n.childshow = false;
            }
          })
        },
        valueFormatOmit(value){
          let _value = value;
          if(value.length >16){
            _value = value.substring(0,13) + "...";
          }
          return _value;
        },
        treeDatasHandler(type){
          let stageWidth = 1000;
          let stageHeight = 500;
          let itemWidth = 200;
          let maxItemLen = 0;
          let maxTreeLen = 0;
          let _this = this;
          let treeDatas = this.treeDatas;
          let rederTrees = [];
          let rederLines = [];
          let treeChart = document.getElementById("treeChart");
          _this.count = 0;
          treeDatas.map(function(n,i){
            _this.treeChildShow2(n,i);
          });

          // return;
          treeDatas.map(function(n,i){
            let _items = [];
            n.map(function(items, j){
              // console.log("items.id", items.id, _this.treeHides.indexOf(items.id) <= -1);
              if(_this.treeHides.indexOf(items.id) <= -1){
                _items.push(items);
              }
            });
            maxItemLen = maxItemLen >= _items.length ? maxItemLen : _items.length;
            rederTrees.push(_items);
          });
          maxTreeLen = treeDatas.length-1;
          stageWidth = stageWidth >= maxItemLen*220 ? stageWidth : maxItemLen*220;
          stageHeight = stageHeight >= maxTreeLen*220 ? stageHeight : maxTreeLen*220;
          treeChart.style.width=stageWidth+"px";
          treeChart.style.height=stageHeight+"px";

          rederTrees.map(function(n,i){
            let _items = [];
            let _total = stageWidth/n.length;

            n.map(function(items, j){
                items[j] = Object.assign(items,{'x': (_total*(j+1) - _total/2) - itemWidth/2, 'y': i*200, valueOmit: _this.valueFormatOmit(items.value) });
            });
          });
          _this.trees = rederTrees;
          // return;
          let _rederTrees = [].concat.apply([],rederTrees);

          _rederTrees.map(function(n,i){
            if(n.childs && n.childs.length > 0 && n.childshow){
              n.childs.map(function(childid,j){
                  let _chlid;
                  _rederTrees.map(function(child,i){
                    if(child.id === childid){
                      _chlid = child;
                      return true;
                    }
                  });
                  let x1 = n.x + 100;
                  let y1 = n.y + 30;
                  let x2 = _chlid.x + 100;
                  let y2 = _chlid.y;
                  let curvenum = 120;
                  rederLines.push({"dpoints":"M"+x1+","+y1+"C"+x1+","+(y1+curvenum)+" "+x2+","+(y2-curvenum)+" "+x2+","+y2 });
              });
            }
          });
          _this.lines = rederLines;
        },
        svgClickHandler(e){
          let _target = e.target;
          let _this = this;
          let _type = _target.dataset["type"];
          let _index = parseInt(_target.dataset["index"]);
          let _childindex = parseInt(_target.dataset["childindex"]);
          let _id = _target.dataset["id"];


          if(typeof(_type)!==undefined && _type==="check"){
            this.trees[_index].map(function(items, i){
              if(items.id === _id){

                if(_this.navinfo.isChecked){
                  items.checked = !items.checked;
                  if(items.checked){
                    if(_this.checkedIds.indexOf(items.id)<=-1){
                      _this.checkedIds.push(items.jobId);
                    }
                  }else{
                    let _idindex = _this.checkedIds.indexOf(items.id);
                    if(_idindex > -1){
                      _this.checkedIds.splice(_idindex,1);
                    }
                  }
                }else{
                  // router.replace({path: "/view/treeView/"+items.jobId});
                  window.open("/#/view/treeView/"+items.jobId+"/0");
                }
                return false;
              }
            });
            return;
          }
          if(typeof(_type)!==undefined){
            let _childs, _isshow = false, _jobId;
            this.treeDatas[_index].map(function(item,index){
              if(item.id == _id){
                item.childshow = !item.childshow;
                _isshow = item.childshow;
                _childs = item.childs;
                _jobId = item.jobId;
              }
            });
            this.treeHides = [];
            if(_isshow){
              if( _childs && _childs.length > 0){
                this.treeDatasHandler();
              }else{
                this.getChildList({jobId: _jobId}, _index+1, _childindex);
              }
            }else{
              this.treeDatasHandler();
            }
          }
        },
        svgOverHandler(e){
          let _target = e.target;
          let _this = this;
          let _type = _target.dataset["type"];
          let _index = parseInt(_target.dataset["index"]);
          let _childindex = parseInt(_target.dataset["childindex"]);
          let _id = _target.dataset["id"];

          if(typeof(_type)!==undefined && _type==="check"){
            let _maxitems = this.trees[_index].length;
            _this.tooltip.isShow = true;
            _this.tooltip.value = this.trees[_index][_childindex].value;
            _this.tooltip.w = _this.tooltip.value.length *13 < 200 ? 200 : _this.tooltip.value.length *13;
            _this.tooltip.tw = _this.tooltip.w/2;
            _this.tooltip.x = _maxitems === _childindex + 1 ? this.trees[_index][_childindex].x - (_this.tooltip.w-200) : this.trees[_index][_childindex].x;
            _this.tooltip.y = this.trees[_index][_childindex].y;

            return;
          }
        },
        svgOutHandler(e){
          let _target = e.target;
          let _this = this;
          let _type = _target.dataset["type"];
          let _index = parseInt(_target.dataset["index"]);
          let _childindex = parseInt(_target.dataset["childindex"]);
          let _id = _target.dataset["id"];

          if(typeof(_type)!==undefined && _type==="check"){
            console.log("svgOutHandler");
            _this.tooltip.isShow = false;
            return;
          }
        },
        checkedAllHandler(e){
          let _this = this;
          this.trees.map(function(items, i){
            items.map(function(childs, j){
              childs.checked = _this.navinfo.checkedAll;
            });
          });
        }
      }
    }
</script>

<style lang="scss">
  @import "src/styles/mixin.scss";
  .treeview-container{
    // padding: 0 0;
    overflow-x: scroll;
  }
  .treeview-nav{
    @include flex;
    @include flex-justify-space-between;
    @include flex-align-center;
    height: 36px;
    margin-bottom: 20px;
    .treeview-nav-jobName span{
      color: #20a0ff;
    }
  }
  .tree-column{
    @include flex;
    @include flex-justify;
    @include flex-align-flex-start;
    list-style: none;
  }
  .tree-row{
    background-color: #000;
    // max-width: 200px;
    border: 1px solid #fff;
    border-radius: 5px;
    color: #fff;
    padding: 5px;
  }
</style>
