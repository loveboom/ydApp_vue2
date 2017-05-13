
<template>
    <div id="statistics">
        <div class="header">
            <!--<router-link to="/">
                <span class="bt_share"><img src="/static/img/nav_icon_out_nor@2x.png" alt=""></span>
            </router-link>-->
            <div class="person" v-if="datas">
                <span class="headPic"><img :src="datas.face" alt=""></span>
                <p class="person_ifo">
                    <i>{{datas.userName}}</i><br/>
                    <i>{{datas.roleName}}</i>
                </p>
            </div>
        </div>
        <!--<div class="navBar">
            <a>
                今日成交额：
            </a>
            <span class="hline"></span>
            <a>
                历史成交额：
            </a>
        </div>-->
        <div class="chartBox">
            <div class="chartHead">
                <span @click="lastMonth()">上一月</span>
                <select v-model="lastOption" ref="newDate" class="select" @change="changeIt()" v-if="Dates">
                    <option ref="selectOption" v-for="(dt,index) in Dates" :value="dt" data-index="index">{{dt}}</option>
                </select>
                <span @click="nextMonth()">下一月</span>
            </div>
            <div class="chartContent">
                <div class="chartItem">
                    <h3>每日销售金额<i>（元）</i></h3>
                    <div id="chartBoxA" class="chartBoxA"></div>
                    <h3>每日订单数<i>（单）</i></h3>
                    <div id="chartBoxB" class="chartBoxA"></div>
                    <h3>每日客单价<i>（元）</i></h3>
                    <div id="chartBoxC" class="chartBoxA"></div>
                </div>
            </div>
        </div>
        <Foot v-if="datas" :roleName="datas.roleName" class="indexA"></Foot>
        <div style="width: 100%;height: 140px"></div>
    </div>
</template>

<script>
import Foot from '@/components/footer.vue';
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入折线图
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

    export default {
        data() {
            return {
                selectNum:'',
                index:'',
                personImg:'/src/img/person.jpg',
                datas:null,
                Dates:null,
                length:null,
                lastOption:null,
                days:[],
                orderAmounts:[],
                orderCounts:[],
                pcts:[],
                obj:null
            }
        },
        created: function (){
            document.title = '首页';
            const newToken = localStorage.getItem("accessToken");
            $.ajax({
                url: 'http://192.168.1.226:8091/member_ship/employee/score/statistic/datas',
                type: 'post',
                crossDomain: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", newToken);
                },
                success: (obj) => {
                    this.datas = obj.data;
                    console.log(this.datas);
                    //默认选中当前月
                    this.Dates = obj.data.times;
                    this.length = this.Dates.length -1;
                    let lastIndex = this.Dates[this.length];
                    this.lastOption = lastIndex;

                    //获取当前月天数,分别传入每日销售金额，每日订单数和每日客单价
                    const dayLength =  this.datas.values.length;
                    this.changeValue(dayLength);

                    var domA = echarts.init(document.querySelector('#chartBoxA'));
                    this.changeChart(domA,(this.days),(this.orderAmounts));

                    var domB = echarts.init(document.querySelector('#chartBoxB'));
                    this.changeChart(domB,(this.days),(this.orderCounts));

                    var domC = echarts.init(document.querySelector('#chartBoxC'));
                    this.changeChart(domC,(this.days),(this.pcts));
                }
            });

            
        },
        mounted(){
            // console.log('this.datas', this.datas);
            // if(this.datas.userName == '推广经理'){
            //     this.$refs.team.css('display','none');
            //     this.$refs.entering.css('display','');
            // }else{
            //     this.$refs.team.css('display','');
            //     this.$refs.entering.css('display','none');
            // }
        },
        components:{
            Foot,
        },
        methods: {
            changeIt:function(){
                this.lastOption = this.$refs.newDate.value;
                console.log('this.lastOption',this.lastOption)
                const newTokenA = localStorage.getItem("accessToken");
                $.ajax({
                    url: 'http://192.168.1.226:8091/member_ship/employee/score/statistic/datas',
                    type: 'post',
                    data:{
                        time:this.lastOption
                    },
                    crossDomain: true,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", newTokenA);
                    },
                    success: (promiseA) => {                 
                        this.datas = null;
                        this.datas = promiseA.data;

                        //获取当前月天数,分别传入每日销售金额，每日订单数和每日客单价
                        const dayLengthA =  this.datas.values.length;
                        this.orderCounts = [];
                        this.pcts = [];
                        this.days = [];
                        this.orderAmounts = [];
                        this.changeValue(dayLengthA);
                        var newChartA = echarts.init(document.querySelector('#chartBoxA'));
                        this.changeChart(newChartA,(this.days),(this.orderAmounts));
                        var newChartB = echarts.init(document.querySelector('#chartBoxB'));
                        this.changeChart(newChartB,(this.days),(this.orderCounts));
                        var newChartC = echarts.init(document.querySelector('#chartBoxC'));
                        this.changeChart(newChartC,(this.days),(this.pcts));
                    }
                });
            },
            changeValue:function(length){
                for(let i = 0; i < length; i++){
                    this.days.push((i + 1) + '日');
                    this.orderAmounts.push(this.datas.values[i].orderAmount);
                    this.orderCounts.push(this.datas.values[i].orderCount);
                    this.pcts.push(this.datas.values[i].pct);
                }
            },
            changeChart:function(val,dataA,dataB){
                val.setOption({
                    title: {
                        text: ''
                    },
                    textStyle:{
                        fontSize:12
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#3ec0c8'
                            }
                        }
                    },
                    legend: {
                        data:'统计报表',
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '0%',
                        right: '8%',
                        top:20,
                        // bottom: 'bottom',
                        height:'80%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dataA,
                            textStyle:{
                                fontSize:18
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            type:'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'top'
                                }
                            },
                            itemStyle : {
                                color:'#1298a0',
                                normal : {  
                                    color:'#1298a0',
                                    lineStyle:{//折线颜色
                                        color:'#3ec0c8'  
                                    }  
                                },
                                textStyle:{
                                    color:'#ddd'
                                }
                            }, 
                            areaStyle: {//背景颜色
                                normal: {color: '#3ec0c8',},
                            },
                            data:dataB,
                        }
                    ]
                })

                window.addEventListener("resize", function () {
                    setTimeout(function () {
                        myChart.resize();
                    }, 1000)
                });
            },
            nextMonth:function(){
                var lengthB = this.datas.times.length;
                var lastChild = this.datas.times[lengthB-1];
                if(lastChild==this.lastOption){
                    alert('已经是最近一个月')
                }else{
                    var A = this.lastOption.substr(0,4);
                    var B = parseFloat(this.lastOption.substr(5,2)) + 1;
                    if(B<10){
                        B = '0' + B;
                    }else if((B-1)==12){
                        A = parseFloat(A) + 1;
                        B = '01';
                    }
                    this.lastOption = A + '-' + B;
                    console.log('this.lastOption',this.lastOption);
                    const newTokenA = localStorage.getItem("accessToken");
                    $.ajax({
                        url: 'http://192.168.1.226:8091/member_ship/employee/score/statistic/datas',
                        type: 'post',
                        data:{
                            time:this.lastOption
                        },
                        crossDomain: true,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", newTokenA);
                        },
                        success: (promiseA) => {                 
                            this.datas = null;
                            this.datas = promiseA.data;

                            //获取当前月天数,分别传入每日销售金额，每日订单数和每日客单价
                            const dayLengthA =  this.datas.values.length;
                            this.orderCounts = [];
                            this.pcts = [];
                            this.days = [];
                            this.orderAmounts = [];
                            this.changeValue(dayLengthA);
                            var newChartA = echarts.init(document.querySelector('#chartBoxA'));
                            this.changeChart(newChartA,(this.days),(this.orderAmounts));
                            var newChartB = echarts.init(document.querySelector('#chartBoxB'));
                            this.changeChart(newChartB,(this.days),(this.orderCounts));
                            var newChartC = echarts.init(document.querySelector('#chartBoxC'));
                            this.changeChart(newChartC,(this.days),(this.pcts));
                        }
                    });
                }

                
            },
            lastMonth:function(){
                var lengthB = this.datas.times.length;
                var lastChild = this.datas.times[0];

                var C = this.lastOption.substr(0,4);
                var D = parseFloat(this.lastOption.substr(5,2)) - 1;
                
                if(lastChild==this.lastOption){
                    alert('已经是最早一个月')
                }else{
                    if(0<=D<10){
                        D = '0' + D;
                        if(parseFloat(D)===0){
                            D = 12;
                            C = C-1;
                        }
                    }else{
                        D = D;
                    }

                    if(D>9){
                       D = parseFloat(D) 
                    }
                    
                    
                    this.lastOption = C + '-' + D;
                    console.log('this.lastOption1',this.lastOption)
                    const newTokenA = localStorage.getItem("accessToken");
                    $.ajax({
                        url: 'http://192.168.1.226:8091/member_ship/employee/score/statistic/datas',
                        type: 'post',
                        data:{
                            time:this.lastOption
                        },
                        crossDomain: true,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", newTokenA);
                        },
                        success: (promiseA) => {                 
                            this.datas = null;
                            this.datas = promiseA.data;

                            //获取当前月天数,分别传入每日销售金额，每日订单数和每日客单价
                            const dayLengthA =  this.datas.values.length;
                            this.orderCounts = [];
                            this.pcts = [];
                            this.days = [];
                            this.orderAmounts = [];
                            this.changeValue(dayLengthA);
                            var newChartA = echarts.init(document.querySelector('#chartBoxA'));
                            this.changeChart(newChartA,(this.days),(this.orderAmounts));
                            var newChartB = echarts.init(document.querySelector('#chartBoxB'));
                            this.changeChart(newChartB,(this.days),(this.orderCounts));
                            var newChartC = echarts.init(document.querySelector('#chartBoxC'));
                            this.changeChart(newChartC,(this.days),(this.pcts));
                        }
                    });
                }

            }
        }
    }
</script>

<style>
#statistics{
    width: 100%;
    background-color: #f6f6f6;
}
.header{
    width: 100%;
    height: 280px;
    background-color: #208f99;
    position: relative;
    overflow: hidden;
}
.bt_share{
    position: absolute;
    right: 20px;
    top: 20px;
    width: 44px;
}
.bt_share img{
    width: 100%;
    height: auto;
}
.chartBox{
    width: 100%;
    margin-top: 20px;
    background-color: #fff;
    overflow-x: hidden;
}
.chartHead{
    height: 90px;
    line-height: 90px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
}
.chartHead span,.chartHead select{
    display: inline-block;
    margin: 0 60px;
}
.chartHead span{
    font-size: 24px;
    color: #999;
}
.chartHead select{
    font-size: 28px;
    color: #333;
}

select {
  /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
  border: none;

  /*很关键：将默认的select选择框样式清除*/
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;

  /*在选择框的最右侧中间显示小箭头图片*/
  background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;


  /*为下拉小箭头留出一点位置，避免被文字覆盖*/
  padding-right: 30px;
  padding-bottom: 6px;
}


/*清除ie的默认选择框样式清除，隐藏下拉箭头*/
select::-ms-expand { display: none; }
.select{
    height: 44px;
    line-height: 44px;
}

.person{
    margin-top: 88px;
    margin-left: 20px;
    overflow: hidden
}
.headPic{
    float: left;
    width: 140px;
    height: 140px;
    border: 3px solid #fff;
    border-radius: 140px;
    overflow: hidden;
}
.headPic img{
    width: 100%;
    height: auto;
}
.person_ifo{
    float: left;
    margin-left: 30px;
    margin-top: 0.4rem;
    line-height: 50px;
    font-size: 24px;
    color: #fff;
}
.navBar{
    width: 100%;
    display: flex;
    background-color: #fff;
}
.navBar a{
    flex: 0.49;
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 28px;
    color: #333; 
}
.navBar a:active{
    color: #fc3e32;
}
.hline{
    width: 1px;
    height: 50px;
    margin-top: 20px;
    background-color: #f0f0f0;
}
.chartContent h3{
    margin: 30px 0 30px 20px;
    font-size: 28px;
    color: #333;
}
.chartContent h3 i{
    font-size: 22px;
    color: #999;
}
.indexA a:first-child{
    color: #fc3e32;
    padding-top: 0.1rem;
}
.chartHead .colorRed{
    color: red;
}
.chartBoxA{
    width: 100%;
    height: 320px;
    overflow: hidden;
}
</style>

