<template>
  <div class="dashboard-outer">
    <el-card class="dashboard-second">
      <el-col class="toolbar1">
        <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="抢庄牛牛游戏日志"></el-popover>
        <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        <span class="title">抢庄牛牛游戏日志</span>
      </el-col>
      <!--工具条-->
      <div>
        <span>用户ID</span>
        <el-input v-model="userId" style="width:120px; margin:20px 10px"></el-input>
        <el-date-picker v-model="logTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="margin:20px 10px" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
        <el-button type="success" icon="search" @click="downloadExcel" style="margin:8px 0px 10px 50px">导出excel</el-button>
      </div>
      <!--列表-->
      <el-table :data="qznnGameLog.qznnGameLogData" border highlight-current-row style="width: 100%;" max-height="460">
        <el-table-column prop="_id" label="日志id" min-width="175" align="center"/>
        <el-table-column prop="logDate" label="日志创建时间" min-width="170" :formatter="timeFormat2" align="center"/>
        <!-- <el-table-column prop="rType" label="房间类型" width="120" align="center" :formatter="rTypeFormat" /> -->
        <el-table-column prop="gameId" label="游戏局号" width="120" align="center"/>
        <el-table-column prop="rid" label="房间号" width="100" align="center"/>
        <el-table-column prop="gid" label="游戏名" width="100" :formatter="gid" align="center"/>
        <el-table-column prop="bets" label="底分" width="120" align="center"/>
        <el-table-column prop="yid" label="场次id" width="100" align="center"/>
        <el-table-column prop="startDate" label="开始时间" min-width="170" :formatter="timeFormat1" align="center"/>
        <el-table-column prop="endDate" label="结束时间" min-width="170" :formatter="timeFormat2" align="center"/>
        <!-- <el-table-column prop="gameData.bankerPoint" label="庄家压分" min-width="80" align="center" /> -->
        <el-table-column label="用户" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" @click="userDetail(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
     <el-col class="toolbar2">
        <el-pagination ref="pageRef" layout="sizes, prev, next" class="pag" @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="page" :page-count="qznnGameLog.totalCount" :page-sizes="[10,20,30,50]"></el-pagination>
      </el-col>
      <!-- 详细信息 -->
      <el-dialog :visible.sync="dialogQznnVisible" width="80%">
        <el-col class="toolbar1">
          <span class="title">玩家日志({{qznnGameLog.gameId}})</span>
          <el-popover ref="popover1" placement="top" itle="标题" trigger="hover" content="抢庄牛牛游戏玩家日志"></el-popover>
          <el-button v-popover:popover1 type="text" class="el-icon-info"></el-button>
        </el-col>
        <!--列表-->
        <el-table :data="qznnGameLog.QznnStageLog" border highlight-current-row style="width: 100%;">
          <el-table-column prop="pos" label="座位号" width="120" align="center"/>
          <el-table-column prop="uid" label="uid" width="100" align="center"/>
          <el-table-column prop="job" label="庄家" width="100" :formatter="isWinnerFormat" align="center"/>
          <el-table-column prop="isWinner" label="是否赢家" width="100" :formatter="isWinner" align="center"/>
          <el-table-column prop="money" label="金币" width="150" align="center"/>
          <el-table-column prop="totalBets" label="总下注" min-width="150" align="center"/>
          <el-table-column prop="chgMoney" label="获得金币" width="150" align="center"/>
          <el-table-column prop="moneyOrg" label="原金币" width="100" align="center"/>
          <el-table-column prop="tax" label="税收" min-width="150" align="center"/>
          <el-table-column prop="userGameData.cards" label="手牌" min-width="150" :formatter="cardRunes" align="center"/>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { QznnGameLogState } from "../../store/stateInterface";
import { downloadExcel } from "../../utils/downloadEXCEL";
import { myDispatch } from "../../utils/index.js";
//GameLog
interface QueryItem {
  userId?: number;
  type: string;
  page: number;
  count: number;
  startTime?: Date;
  endTime?: Date;
}
let A2KSymbols = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class GameLog extends Vue {
  // lifecycle hook
  created() {
    this.loadData(); //初始化-->加载数据
  }
  searchData() {
    this.page = 1;
    this.loadData();
  }
  /*inital data*/
  qznnGameLog: QznnGameLogState = this.$store.state.qznnGameLog; //表单数据
  dialogQznnVisible: boolean = false;
  userId: string = "";
  logTime: Date[] = [];
  page: number = 1; //当前页
  count: number = 30;
  // totalCount: number = 0;

  /*method*/
  loadData() {
    if (!this.userId && (!this.logTime || !this.logTime.length)) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    let queryItem: QueryItem = this.getQueryItem();
    queryItem.page = this.page;
    queryItem.count = this.count;
    myDispatch(this.$store, "GetQznnGameLog", queryItem).then(() => {
      this.setPagination();
    });
  }
  setPagination() {
    const pagination: any = this.$refs.pageRef;
    if (this.page === 1) {
      this.qznnGameLog.totalCount = 1;
    }
    if (this.qznnGameLog.next) {
      if (this.page >= pagination.lastEmittedPage || this.page === 1) {
        this.qznnGameLog.totalCount += 1;
      } else {
        this.qznnGameLog.totalCount -= 1;
      }
    }
  }
  //获取查询条件
  getQueryItem() {
    let temp: any = {
      type: "QZNN"
    };
    if (this.userId.trim()) {
      temp.userId = this.userId;
    }
    if (this.logTime) {
      temp.startTime = this.logTime[0];
      temp.endTime = this.logTime[1];
    }
    return temp;
  }
  userDetail(index, row) {
    //将当前的user字段的数据，保存到全局的store中
    let tmp = JSON.parse(JSON.stringify(row.users));
    let payload = {
      gameId: row.gameId,
      data: tmp
    };
    this.$store.commit("SET_CUBQZNNUSERDETAIL", payload);
    this.dialogQznnVisible = true;
  }
  //日期整形
  timeFormat1(row, column) {
    let date = new Date(row.startDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  timeFormat2(row, column) {
    let date = new Date(row.endDate);
    let sdate = date.toLocaleString(undefined, {
      hour12: false,
      timeZone: "Asia/Shanghai"
    });
    return sdate;
  }
  //游戏名称整形
  gid(row, column) {
    if (row.gid == "QZNN") {
      return "抢庄牛牛";
    }
  }
  isWinner(row, column) {
    return row.chgMoney > 0 ? "是" : "否";
  }
  isWinnerFormat(row, column) {
    return row.userGameData ? (!row.userGameData.job ? "是" : "否") : "否";
  }
  getSuit(card: number) {
    return card >> 8;
  }
  getPoint(card: number) {
    return card & 0x000000ff;
  }
  getHandleCard(rune) {
    let cardRunesStr = "";
    rune.forEach(e => {
      let suit = this.getSuit(e);
      let point = this.getPoint(e);
      if (point === 20) {
        cardRunesStr += "大王";
      } else if (point === 18) {
        cardRunesStr += "小王";
      } else {
        let cardRunes = this.suitPointFormatter(suit, point);
        cardRunesStr += cardRunes.suit + cardRunes.point + "     ";
      }
    });
    return cardRunesStr;
  }
  suitPointFormatter(suit, point) {
    let suitString = "";
    let pointString = "";
    console.log(suit, point);
    switch (suit) {
      case 0:
        suitString = "♠️";
        break;
      case 1:
        suitString = "♥️";
        break;
      case 2:
        suitString = "♣️";
        break;
      case 3:
        suitString = "♦️";
        break;
    }
    pointString = A2KSymbols[point - 1];
    return { suit: suitString, point: pointString };
  }
  cardRunes(row, column) {
    let result = "";
    console.log(row);
    if (row.userGameData.handCards) {
      result = this.getHandleCard(row.userGameData.handCards);
    }
    return result;
  }
  //房间类型
  rTypeFormat(row, column) {
    switch (row.rType) {
      case 1:
        return "匹配房";
      case 2:
        return "好友房";
    }
  }
  //页码变更
  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }
  //导出excle
  downloadExcel() {
    const downloadExcelCfg = [
      {
        title: "日志id",
        field: "_id",
        type: "string"
      },

      {
        title: "日志创建时间",
        field: "logDate",
        type: "Date"
      },
      {
        title: "房间类型",
        field: "rType",
        type: "string"
      },
      {
        title: "游戏局号",
        field: "gameId",
        type: "string"
      },
      {
        title: "房间号",
        field: "rid",
        type: "string"
      },
      {
        title: "游戏名",
        field: "gid",
        type: "string"
      },
      {
        title: "底分",
        field: "bets",
        type: "string"
      },
      {
        title: "场次ID",
        field: "yid",
        type: "string"
      },
      {
        title: "开始时间",
        field: "startDate",
        type: "Date"
      },
      {
        title: "结束时间",
        field: "endDate",
        type: "Date"
      }
    ];
    if (!this.userId && !this.logTime) {
      this.$message({
        type: "error",
        message: "必须输入任一搜索条件"
      });
      return;
    }
    let queryItem: QueryItem = this.getQueryItem();
    myDispatch(this.$store, "GetQznnGameLogExcel", queryItem).then(ret => {
      downloadExcel(ret, this);
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    // margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
.toolbar1 {
  padding: 5px;
  background-color: #f9fafc;
  border: 2px;
  display: block;
  margin: 0;
}
.toolbar2 {
  padding: 30px;
  background-color: #f9fafc;
  border: 2px;
  margin: 0px 0px;
}
.pag {
  padding: 0px;
  margin: -10px 0px 0px 10px;
  float: right;
}
</style>
