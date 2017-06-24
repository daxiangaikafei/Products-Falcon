<template>
  <div class="home-container">
    <ul class="icons">
      <li><Icon icon-name="sync" :size="32" class="loading" ></Icon><span class="title">sync</span></li>
      <li><Icon icon-name="home" color="#427cf3" :size="32"  ></Icon><span class="title">home</span></li>
      <li v-for="item in icons" :key="item">
        <Icon :icon-name="item.replace(/icon-/ig, '')" :size="32"></Icon>
        <span class="title">{{item.replace(/icon-/ig, '')}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  let url = require('assets/iconsvg/symbol-defs.svg')

  function getText(url) {
    var promise = new Promise(function (resolve, reject) {
      var client = new XMLHttpRequest()
      client.open("GET", url)
      client.onreadystatechange = handler
      client.responseType = "text"
      client.setRequestHeader("Accept", "text/plan")
      client.send()

      function handler() {
        if (this.readyState !== 4) {
          return
        }
        if (this.status === 200) {
          resolve(this.response)
        } else {
          reject(new Error(this.statusText))
        }
      }
    })
    return promise;
  };

  export default {
    mounted() {
      getText(url).then( data => {
        let txt = data
        if ( !txt || txt === '') return 
        this.icons = txt.match(/icon-[A-Za-z0-9-]+(?=")/gm)
        console.log('Icons count:'+this.icons.length)
      }, function (error) {
        console.error('Error:', error)
      })
    },
    data () {
      return {
        icons: ''
      }
    }
  }
</script>
<style lang="scss">
  @import "src/styles/mixin.scss";

  .home-container {
      background-color: #fff;
      .icons {
          padding: 0;
          list-style: none;
          width: 100%;
          margin: 20px auto;
          @include flex;
          @include flex-wrap;
          li {
              width: 5%;
              background-color: #f9f9f9;
              border: 1px solid #fff;
              padding: 20px 0 10px;
              text-align: center;
              @include flex-item-auto;
              &:hover {
                  color: #fff !important;
                  background-color: #427cf3;
                  svg {
                      fill: #fff !important;
                  }
              }
              svg {
                  margin-bottom: 10px;
                  color:#427cf3;
                  
              }
              .title {
                  display: block;
                  text-align: center;
                  word-wrap: break-word;
                  margin-top: 10px;
              }
          }
      }
      .loading {
          animation: loading 1s linear infinite;
      }
      @keyframes loading {
          0% {
              transform: rotateZ(0deg)
          }
          100% {
              transform: rotateZ(360deg)
          }
      }
  }
</style>
