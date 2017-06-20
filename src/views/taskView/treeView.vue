<template>
  <div class="app-container ">
    <TaskMenu />
    <svg id="treeChart" version="1.1" @click="svgClickHandler" xmlns="http://www.w3.org/2000/svg">
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
          <rect width="200" height="30" v-bind:data-index="index"  v-bind:data-id="child.id"  stroke="#324157" stroke-width="1" v-bind:fill="'' + (child.checked ? '#324157' : '#ffffff') + ''"/>
          <text x="100" y="20" v-bind:data-index="index"  v-bind:data-id="child.id" text-anchor="middle" v-html="child.value" v-bind:fill="'' + (child.checked ? '#ffffff  ' : '#324157') + ''"></text>

          <g v-if="child.childs && child.childs.length > 0 " transform="translate(175,0)">
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
    </svg>
  </div>
</template>

<script>
    import { fetchSubTaskList } from 'api/task';
    import { parseTime, objectMerge } from 'utils';
    import TaskMenu from './taskMenu'
    //<line x1="320" y1="30" x2="110" y2="100" style="stroke:rgb(0,0,0);stroke-width:2"/>
    export default {
      name: 'treeView',
      components: {
        TaskMenu
      },
      data() {
        return {
          count: 0,
          trees: [],
          lines: [],
          checkedIds:[],
          treeDatas: [
            [{
              id: 1,
              checked: false,
              childs: [22,23,24],
              childshow: true,
              value: "1"
            },{
              id: 2,
              checked: false,
              childs: [21],
              childshow: false,
              value: "2"
            },{
              id: 3,
              checked: false,
              childs: [23],
              childshow: true,
              value: "3"
            },{
              id: 4,
              checked: false,
              value: "4"
            }],
            [{
              id: 21,
              checked: false,
              value: "21"
            },{
              id: 22,
              checked: false,
              value: "22"
            },{
              id: 23,
              checked: false,
              childs: [31],
              childshow: false,
              value: "23"
            },{
              id: 24,
              checked: false,
              value: "24"
            },{
              id: 25,
              checked: false,
              childs: [32],
              childshow: true,
              value: "25"
            },{
              id: 26,
              checked: false,
              value: "26"
            }],
            [{
              id: 31,
              checked: false,
              childs: [42],
              childshow: true,
              value: "31"
            },{
              id: 32,
              checked: false,
              childs: [41],
              childshow: true,
              value: "32  "
            }],
            [{
              id: 41,
              checked: false,
              value: "41"
            },{
              id: 42,
              checked: false,
              value: "42"
            }],
            [{
              id: 51,
              checked: false,
              value: "51"
            },{
              id: 52,
              checked: false,
              childs: [62],
              value: "52"
            }],
            [{
              id: 61,
              checked: false,
              value: "61"
            },{
              id: 62,
              checked: false,
              value: "62"
            }]
          ],
          treeHides: [],
          loading: false
        }
      },
      created() {
        this.getList();
      },
      mounted() {
        this.treeDatasHandler();
      },
      watch: {

      },
      methods: {
        childsIsHide: function(items,chid,cIndex){
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
                items[j] = Object.assign(items,{'x': (_total*(j+1) - _total/2) - itemWidth/2, 'y': i*200 });
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
          let _index = _target.dataset["index"];
          let _childindex = _target.dataset["childindex"];
          let _id = parseInt(_target.dataset["id"],10);
          if(typeof(_type)=="undefined" && typeof(_index)!="undefined" && typeof(_id)!="undefined"){
            this.trees[_index].map(function(items, i){
              if(items.id === _id){
                items.checked = !items.checked;
                if(items.checked){
                  if(_this.checkedIds.indexOf(items.id)<=-1){
                    _this.checkedIds.push(items.id);
                  }
                }else{
                  let _idindex = _this.checkedIds.indexOf(items.id);
                  if(_idindex > -1){
                    _this.checkedIds.splice(_idindex,1);
                  }
                }
                return false;
              }
            });
          }
          if(typeof(_type)!="undefined" && typeof(_index)!="undefined" && typeof(_id)!="undefined" && typeof(_childindex)!="undefined"){
            let _childs = [], _isshow = false;
            this.treeDatas[_index].map(function(item,index){
              if(item.id == _id){
                item.childshow = !item.childshow;
                _isshow = item.childshow;
                _childs = item.childs;
              }
            });
            this.treeHides = [];

            // let _haverepeat = [];
            // this.treeDatas[_index].map(function(item,index){
            //   if(item.childs && item.childs.length > 0){
            //     if(_isshow){
            //       _childs.map(function(childid,j){
            //         // console.log(item.childs.indexOf(childid) > -1 , _childs, childid);
            //         if(item.childs.indexOf(childid) > -1){
            //           item.childshow = true;
            //           _haverepeat.push(childid);
            //         }else{
            //           if(_haverepeat.indexOf(childid) > -1){
            //             item.childshow = true;
            //           }
            //         }
            //       });
            //     }else{
            //       _childs.map(function(childid,j){
            //         if(item.childs.indexOf(childid) > -1){
            //           item.childshow = false;
            //         }
            //       });
            //     }
            //   }
            // });

            this.treeDatasHandler();
          }
        }
      }
    }
</script>

<style lang="scss">
  @import "src/styles/mixin.scss";
  .app-container{
    // padding: 0 0;
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
