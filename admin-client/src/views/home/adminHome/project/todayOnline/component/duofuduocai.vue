<template>
    <div>
        <div id="chartLineYQ16" style="width:100%; height:630px;padding: 10px;"></div>
    </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";

import echarts from "echarts";
import { AdminHome } from "../../../../../../store/stateInterface";
import { TodayAndYestRealOnline } from "../../../../../../store/modules/home/adminHome";
import { myDispatch } from "../../../../../../utils/index";
import { Prop } from "vue-property-decorator";

// import { Getter, Action } from "vuex-class";
var colors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae"];
// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class Total extends Vue {
    @Prop(String) pid!: string;
    //初始化数据
    adminHome: AdminHome = this.$store.state.adminHome;
    todayOnline: TodayAndYestRealOnline[] = this.adminHome.todayOnline;
    yesterdayOnline: TodayAndYestRealOnline[] = this.adminHome.yesterdayOnline;
    valueTime = [null, null];
    chartLineYQ16: any;
    mounted() {
        this.loadData();
    }
    loadData() {
        console.log(document.getElementById("chartLineYQ16"));
        myDispatch(
            this.$store,
            "GetPTodayAndYestRealOnline",
            { pid: this.pid },
            true
        ).then(() => {
            this.todayOnline = this.adminHome.todayOnline;
            this.yesterdayOnline = this.adminHome.yesterdayOnline;

            let xData: string[] = [];
            let yData1: number[] = [];
            let yData2: number[] = [];
            //echarts.dispose()
            this.chartLineYQ16 = echarts.init(
                document.getElementById("chartLineYQ16")
            );

            this.todayOnline.forEach(item => {
                xData.push(item.graphDate);
                yData1.push(Number(item.duofuduocaiRealOnline));
            });
            this.chartLineYQ16.showLoading({
                text: ""
            });

            this.yesterdayOnline.forEach(item => {
                yData2.push(Number(item.duofuduocaiRealOnline));
            });
            this.drawLineChart(xData, yData1, yData2);
        });
    }
    drawLineChart(xData, yData1, yData2) {
        //获取实时数据库数据
        this.chartLineYQ16.setOption({
            color: colors,
            title: {
                text: ""
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ["今日总计", "昨日总计"],
                padding: [5, 10]
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: xData
                }
            ],
            yAxis: {
                type: "value"
            },
            series: [
                {
                    name: "今日总计",
                    type: "line",
                    smooth: true,
                    symbol: "none",
                    sampling: "average",
                    itemStyle: {
                        color: colors[0]
                    },
                    data: yData1
                },
                {
                    name: "昨日总计",
                    type: "line",
                    smooth: true,
                    symbol: "none",
                    sampling: "average",
                    itemStyle: {
                        color: colors[1]
                    },
                    data: yData2
                }
            ]
        });
        this.chartLineYQ16.hideLoading();
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>