<template>
  <div class="dashboard-outer">  
        <div>
            <jinhua-matchrules></jinhua-matchrules>
        </div>
        <div>
            <jinhua-matchstages></jinhua-matchstages>
        </div>
        <div>
            <graph></graph>
        </div>      
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import jinhuaMatchRules from "./jinhuaMatchRules.vue";
import jinhuaMatchStages from "./jinhuaMatchStages.vue";
import graph from "./graph.vue";
// import { Getter, Action } from "vuex-class";

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    "graph": graph,
    "jinhua-matchrules": jinhuaMatchRules,
    "jinhua-matchstages": jinhuaMatchStages
  }
})
export default class JinhuaGameConfig extends Vue {}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
</style>
