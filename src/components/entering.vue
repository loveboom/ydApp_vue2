
<template>
<div class="bgBox">
    <div class="register">
        <form>
            <ul class="rsBox">
                <li>
                    <label class="title" for="title">店铺名称</label>
                    <input v-model="name" class="text" id="title" type="text" placeholder="请输入店铺名称">
                </li>
                <li>
                    <label class="title" for="name">店主姓名</label>
                    <input v-model="owner" class="text" id="name" type="text" placeholder="输入姓名">
                </li>
                <li>
                    <label class="title" for="tel">店主手机</label>
                    <input v-model="mobile" class="text" id="tel" type="number" placeholder="输入手机号">
                </li>
                <li class="active" @click="showEngage">
                    <i class="title" >主营业务</i>
                    <i class="choose" ref="jobs">{{egs}}</i>
                    <i class="iconfont arrow_right">&#xe620;</i>
                </li>
                <li class="active" @click="show">
                    <i class="title">所在地区</i>
                    <i class="choose" ref="area">请选择</i>
                    <i class="iconfont arrow_right">&#xe620;</i>
                </li>
                <li class="active" style="background: #fff;">
                    <i class="title">街道</i>
                    <i class="choose" ref="street">请选择</i>
                    <!--<i class="iconfont arrow_right">&#xe620;</i>-->
                </li>
                <div>
                    <textarea class="address" name="" id="" placeholder="详细地址"></textarea>
                </div>
            </ul>
            <div class="submit"><input @click="submit" type="button" value="注册"></div>
        </form>

        <div class="province" ref="province" style="display: none">
             <ul class="rsBox">
                <li class="active" v-for="(dt,index) in datas" @click="getID(dt.id,dt.name)">
                    <i class="title" style="color: #333;">{{dt.name}}</i>
                    <i class="iconfont arrow_right">&#xe620;</i>
                </li>
             </ul>
        </div>

        <div class="province" ref="engageA" style="display: none">
             <ul class="rsBox">
                <li class="active" v-for="(eg,index) in engeges" @click="getEngage(index)">
                    <i class="title" style="color: #333;">{{eg.name}}</i>
                </li>
             </ul>
        </div>
    </div>
</div>
</template>
<script>
    export default{
        data(){
            return{
                datas:[],
                engeges:[],
                egs:'请选择',
                id:null,
                keys:[],
                names:[],
                name:'',//店铺名称
                owner:'',//店主姓名
                mobile:'',//手机号
                engage:'',//主营业务
                province:'',//省
                city:'',//市
                county:'',//区
                town:'',//街道
                address:'',//地址
            }
        },
        created(){
            document.title = '录入客户信息';

            const newToken = localStorage.getItem("accessToken");
            $.ajax({
                url:'http://192.168.1.226:8091/member_ship/address/listRegion',
                type:'GET',
                crossDomain: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", newToken);
                },
                success: (obj) => {
                    console.log('obj',obj)
                    this.datas = obj.data;
                }
            })
            $.ajax({
                url:'http://192.168.1.226:8091/member_ship/account/engaga',
                type:'GET',
                crossDomain: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", newToken);
                },
                success: (eg) => {
                    this.engeges = eg.data;
                    console.log('this.engeges',this.engeges)
                }
            })
        },
        methods:{
            //显示弹出层
            show:function(){
                this.$refs.province.style.display = 'block';
            },
            //选择地区
            getID: function(key,value) {
                this.id = key;
                this.names.push(value); 
                this.keys.push(key);
                this.province = this.names[0];
                this.city = this.names[1];
                this.county = this.names[2];
                this.town = this.names[3];
                this.address = this.names[4];
                console.log('this.town',this.town)
                const newToken = localStorage.getItem("accessToken");
                $.ajax({
                    url:'http://192.168.1.226:8091/member_ship/address/listRegion',
                    type:'GET',
                    data:{
                        pRegionId:this.id
                    },
                    crossDomain: true,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", newToken);
                    },
                    success: (newData) => {
                        this.datas = newData.data;
                        if(this.datas.length==0){
                            this.$refs.province.style.display = 'none';
                            this.$refs.street.innerHTML = this.names[4];
                            this.$refs.street.style.color = '#333';
                        }else{
                            this.$refs.area.innerHTML = this.names[0] + '&nbsp;' +this.names[1] + '&nbsp;'
                             +this.names[2] + '&nbsp;' +this.names[3];
                             this.$refs.area.style.color = '#333';
                        }
                        console.log('this.datas',this.datas)
                    }
                })
                
            },
            //主营业务
            showEngage: function(){
                this.$refs.engageA.style.display = 'block';
            },
            //主营业务
            getEngage:function(index){
                this.egs = this.engeges[index].name;
                this.$refs.engageA.style.display = 'none';
                this.$refs.jobs.style.color = '#333';
            },

            submit:function(){
                //验证手机号
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
                if(!myreg.test(this.mobile)) 
                { 
                    alert('请输入有效的手机号码！'); 
                    return false; 
                } 

                const newToken = localStorage.getItem("accessToken");
                $.ajax({
                    url:'http://192.168.1.226:8091/member_ship/account/registerMerchant',
                    type:'POST',
                    data:{
                        name:this.name,
                        owner:this.owner,
                        mobile:this.mobile.toString(),
                        engage:this.engage,
                        province:this.province,
                        city:this.city,
                        county:this.county,
                        town:this.town,
                        address:this.address
                    },
                    crossDomain: true,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", newToken);
                    },
                    success: (obj) => {
                        console.log(obj)
                        if(obj.successful == true){
                            alert('录入商户信息成功');
                            window.location = '/entering'
                        }
                    }
                })
            }

        }
    }
</script>
<style scoped>
input::-webkit-input-placeholder { 
color:#333;
}
input:-moz-placeholder {
color:#333;
}
input::-moz-placeholder { 
color:#333;
}
input:-ms-input-placeholder { 
color:#333;
}
input[placeholder], [placeholder], *[placeholder] { 
color:#333 !important; 
} 
.bgBox{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color:#f6f6f6;
}
.register{
    width: 100%;
    margin-top: 30px;
}
.rsBox{
    background-color: #fff;
}
.rsBox li{
    height: 100px;
    line-height: 100px;
    border-bottom: 1px solid #f0f0f0;
    overflow: hidden;
}
.title{
    float: left;
    width: 160px;
    padding-left: 20px;
    text-align: left;
    color: #999;
    font-size: 28px;
}
.text{
    float: left;
    width: 570px;
    height: 100px;
    font-size: 28px;
    color: #333;
}
.choose{
    float: left;
    font-size: 28px;
    color: #999;
}
.arrow_right{
    float: right;
    margin-right: 20px;
    font-size: 36px;
    color: #999;
}
.active:active{
    background-color: #eee;
}
.address{
    display: block;
    padding: 20px;
    width: 710px;
    min-height: 200px;
    background: #fff;
    border: none;
    font-size: 28px;
    color: #333;
}
.submit{
    width: 100%;
    margin-top: 80px;
}
.submit input{
    display: block;
    width: 490px;
    margin: 0 auto;
    height: 90px;
    line-height: 90px;
    text-align: center;
    background-color: #fc3e32;
    color: #fff;
    font-size: 34px;
    border-radius: 10px;
}

.province{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: #fff;
    z-index: 1;
}
</style>