
<template>
    <div>
        <div class="page">
            <header ref="header">我的团队</header>
            <div class="tabdiv">
                <div class="tabbar">
                    <span @click="tap_one" :class="this.type==='A'?'selected':''">当月业绩榜</span>
                    <span @click="tap_two" :class="this.type==='B'?'selected':''">总业绩榜</span>
                    <span @click="tap_thr" :class="this.type==='C'?'selected':''">成员</span>
                </div>
            </div>
            <section v-if="this.type === 'A'" class="listItems">
                <div class="rankItem" v-for="(dt,index) in datas">
                    <span :class="index<3?'rankbg':'rankicon'">{{index+1}}</span>
                    <ul class="user">
                        <li class="username">{{dt.userName}}</li>
                    </ul>
                    <div class="money">
                        <span style="margin-right: 30px;">金额</span>
                        <span ref="money">{{dt.monthAmount}}</span>
                    </div>
                </div>
            </section>
            <section v-else-if="this.type === 'B'" class="listItems">
                <div class="rankItem" v-for="(dt,num) in datas">
                    <span :class="num<3?'rankbg':'rankicon'">{{num+1}}</span>
                    <ul class="user">
                        <li class="username">{{dt.userName}}</li>
                    </ul>
                    <div class="money">
                        <span style="margin-right: 30px;">金额</span>
                        <span ref="money">{{dt.totalAmount}}</span>
                    </div>
                </div>
            </section>
            <section v-else="this.type === 'C'" class="chooseContent">
                <div class="number" v-for="(mb,index) in members">
                    <div class="numberHead">
                        <span class="logo">
                            <img :src="mb.portraitUrl" />
                        </span>
                        <ul class="username">
                            <li class="userName">{{mb.name}}</li>
                            <li class="grade">{{mb.duties}}</li>
                            <li class="total" style="margin-top: 0.1rem;"><i>总成交额：</i><i>&yen;&nbsp;{{mb.orderAmount}}</i></li>
                            <li class="total"><i>总订单数：</i><i>{{mb.orderCount}}</i></li>
                        </ul>
                        <a class="linkB" @click="refresh(index)">
                            <span class="downLine"><i>{{mb.employeeNum}} 下线</i><i class="iconfont" style="font-size: 0.4rem">&#xe620;</i>
                            </span>
                        </a>
                </div>
            </div>
        </section>
    </div>
        <Foot class="activeA"></Foot>
        <div style="width: 100%;height: 140px"></div>
    </div>
</template>

<script>
    import Foot from '@/components/footer.vue';
    export default {
        data () {
            return {
                datas: [],
                type: 'A',
                members:[],
                userId:[]
            }
        },
        components: {
            Foot,
        },

        created: function () {
            const newToken = localStorage.getItem("accessToken");
            const that = this;
            $.ajax({
                url: 'http://192.168.1.226:8091/member_ship/employee/score/amount',
                type: 'post',
                crossDomain: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", newToken);
                },
                success: function (aaa) {
                    that.datas = aaa.data;
                    console.log('that.datas', that.datas);
                    //数字转本地
                    const length = that.datas.length;
                    for (let i = 0; i < length; i++) {
                        let newMoney = that.datas[i].monthAmount;
                        let totalMoney = that.datas[i].totalAmount;
                        const monthAmount = parseFloat(newMoney).toLocaleString();
                        const totalAmount = parseFloat(totalMoney).toLocaleString();
                        that.datas[i].monthAmount = monthAmount;
                        that.datas[i].totalAmount = totalAmount;
                    }
                }
            });

        },

        methods: {
            tap_one: function () {
                this.type = 'A'
            },
            tap_two: function () {
                this.type = 'B'
            },
            tap_thr: function () {
                this.type = 'C';
                const Token = localStorage.getItem("accessToken");
                $.ajax({
                    url: 'http://192.168.1.226:8091/member_ship/employee/score/members-data',
                    type: 'post',
                    crossDomain: true,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", Token);
                    },
                    success: (obj) => {
                        this.members = obj.data;
                        var length = obj.data.length;
                        for(var n = 0; n<length; n++){
                            this.userId.push(obj.data[n].userId);
                            console.log('this.userId',this.userId);
                        }
                    }
                });
            },
            refresh:function(index){
                const Token = localStorage.getItem("accessToken");
                var userId = this.userId[index];
                console.log('userId',userId)
                $.ajax({
                    url: 'http://192.168.1.226:8091/member_ship/employee/score/members-data',
                    type: 'post',
                    data:{
                        userId:userId
                    },
                    crossDomain: true,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", Token);
                    },
                    success: (obj) => {
                        console.log('obj',obj)
                        this.members = obj.data;
                    }
                });
            }
        },
    }

</script>

<style>
body,html{
    height: 100%;
    overflow-y: auto;
}
body{
    background-color:#f0f0f0;
}
.page {
    width: 100%;
}
.page header {
    width: 100%;
    height: 90px;
    text-align: center;
    line-height: 90px;
    background-color:#fff;
    color: #333;
    font-size: 34px;
    font-weight: 400;
}
.none{
    display: none;
}
.activeA a:nth-child(2){
    color: #fc3e32;
}
.activeA a:first-child{
    padding-top: 0.1rem;
}
.tabdiv{
    padding: 20px;
}
.tabbar{
    width: 8.02rem;
    margin: 0 auto;
    border: 1px solid #fc3e32;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;
}
.tabbar span{
    float: left;
    width: 2.666rem;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 26px;
    color: #333;
}
.tabbar .selected{
    background-color: #fc3e32;
    color: #fff;
}    
.rankItem{
    padding: 30px 20px 30px 30px;
    border-bottom: 1px solid #f0f0f0;
    overflow: hidden;
}
.rankItem:last-child{
    border-bottom: none;
}
.rankicon{
    float: left;
    width: 44px;
    height: 44px;
    line-height: 44px;
    background-color: #808080;
    color: #fff;
    text-align: center;
    border-radius: 44px;
}
.rankItem .rankbg{
    float: left;
    width: 44px;
    height: 44px;
    font-size: 0;
}
.rankItem:nth-child(1) .rankbg{
    background: url(/static/img/icon1.jpg) no-repeat center;
    background-size: contain;
}
.rankItem:nth-child(2) .rankbg{
    background: url(/static/img/icon2.jpg) no-repeat center;
    background-size: contain;
}
.rankItem:nth-child(3) .rankbg{
    background: url(/static/img/icon3.jpg) no-repeat center;
    background-size: contain;
}
.user{
    float: left;
    margin-left: 30px;
}
.username{
    font-size: 28px;
    color: #333;
}
.usernum,.money{
    font-size: 24px;
    color: #999;
    overflow: hidden;
}
.usernum i,.money span{
    display: inline-block;
    width: 160px;
    text-align: right;
}
.money{
    float: right;
}
.listItems{
    background-color: #fff;
}
.chooseContent .number{
    width: 710px;
    margin: 0 auto;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
}
.chooseContent .number:first-child{
    margin-top: 0;
}
.numberHead{
    position: relative;
    padding: 20px;
    padding-left: 0;
    margin-left: 0.267rem;
    overflow: hidden;
}
.logo{
    float: left;
    width: 180px;
    height: 180px;
    border-radius: 80px;
}
.logo img{
    width: 100%;
    height: auto;
}
.username{
    float: left;
    margin-left: 20px;
    line-height: 40px;
    font-size: 28px;
    color: #333;
}
.downLine{
    float: right;
    margin-right: 10px;
    margin-top: 0.3rem;
    color: #333;
}
.userName{
    margin-top: 0.1rem;
    font-size: 32px;
    color: #333;
}
.grade{
    background-color: #fce5e4;
    text-align: center;
    margin-top: 0.1rem;
    color: #fc3e32;
    font-size: 24px;
}
.total{
    font-size: 22px;
}
.total i:last-child{
    color: #fc3e32;
}
.linkB{
    position: absolute;
    right: 0.3rem;
    top: 34%;
}
</style>