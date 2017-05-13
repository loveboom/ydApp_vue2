<style scoped>
body{
    background-color: #fff;
}
    #login{
           width: 100%;
    }
    .login-back{
        width:750px;
        height:60px;
    }

    .back-text{
        width:750px;
        height:1.2rem;
        line-height:1.2rem;
        text-align:center;
        position:relative;
        font-size:35px;
    }
   .back{      
        position:absolute;
        left:20px;
    }
    .back span{
        font-size:30px;
    }
    .login_fields {
        width:750px;
        height: 800px;
        position: absolute;
        margin-top:110px;
    }
    .login_fields__user{
        height:88px;
        border-bottom:1px solid #ccc;
        line-height:88px;
        position:relative;
    }
    .loginphone{
        padding-left:20px;
        padding-right:30px;
        font-size:35px;
        color:#fc3e32;
    }
    .user-clear{
        position:absolute;
        right:10px;
        font-size:35px;
    }
    .user-clear2{
        padding-right:50px;
        font-size:35px;
    }
    .eye{
        position:absolute;
        right:10px;
        padding-top:6px;
        font-size:40px;
    }
    .login_show_password{
        height:88px;
        border-bottom:1px solid #ccc;
        line-height:88px;
        position:relative;
        display:block;        
    }
    .login_hide_password{
        height:88px;
        border-bottom:1px solid #ccc;
        line-height:88px;
        position:relative;
        display:none;
    }
    input{
        width:540px;
        border:0;
        height:0.9rem;
    }
    .login-text{
        width:100%;
        height:80px;
        line-height:80px;
        position:relative;
    }
    .register{
        padding-left:20px;
    }
    .forget{
        position:absolute;
        right:20px;
    }
    .submit_login{
        margin-top:330px;
        margin-left:125px;
        width:500px;
        height:88px;
        background:#888888;
        line-height:88px;
        border-radius:5px;
        text-align:center;
        color:#fff;
    }
    .active{
        background-color:#fc3e32;
    }
</style>
<template>
    <div id="login">
        <div class="login-back">            
            <p class="back-text"><a href="" class="back"><span class="iconfont">&#xe600;</span></a>银点登录</p>
        </div>
         <div class='login_fields'>
            <div class='login_fields__user'>
                <span class='loginphone iconfont'>&#xe737;</span>
                <input v-model="userName" placeholder='用户名' type='number' id="login_user" ref="login_user" class="one"></input>
                <span class="user-clear iconfont" @click="Clearuser()">&#xe682;</span>
            </div>
            <div class="login_fields_password">
              <div class='login_show_password' ref="show_password">
                    <span class='loginphone iconfont'>&#xe65e;</span>
                    <input placeholder='密码' type='password' id="login_pwd" ref="login_pwd" class="two"></input>
                    <span class="user-clear iconfont user-clear2" @click="Clearuser1()">&#xe682;</span>
                    <span class="eye iconfont" @click="showPsw()">&#xe614;</span>
                </div>
                <div class='login_hide_password' ref="hide_password">
                    <span class='loginphone iconfont'>&#xe65e;</span>
                    <input placeholder='密码' type='text' id="login_hidepwd" ref="login_hidepwd" class="two"></input>
                    <span class="user-clear iconfont user-clear2" @click="Clearuser1()">&#xe682;</span>
                    <span class="eye iconfont" @click="hidePsw()">&#xe614;</span>
                </div>
            </div>
            <!--<div class="login-text">
                <span class="register">立即注册</span>
                <span class="forget">忘记密码</span>
            </div>-->
            <div class="submit_login" @click="isLogin()" ref="submit_login">
               登录
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            login_user:'',
            login_pwd:'',
            userName:'',
        }
    },
  methods: {
    isLogin() {
       const username = this.$refs.login_user.value;
       const password = this.$refs.login_pwd.value;
       const submit_login = this.$refs.submit_login;
       const token = createToken(username, password);                         
       const accessToken = token.getToken();//调用获取Token的函数，即Token
        localStorage.setItem("accessToken", accessToken);//将Token储存在localstorage
        localStorage.setItem("userName",this.userName);
        var getaccessToken = localStorage.getItem("accessToken");
        console.log(getaccessToken)
        if (accessToken != null) {
            window.location.href = "/statistics"; // 回到首页
        }
    },
    Clearuser(){
      const username = this.$refs.login_user;//用户名
            username.value = '';                
    },
    Clearuser1(){
      const login_pwd = this.$refs.login_pwd;//密码
      const login_hidepwd = this.$refs.login_hidepwd;
            login_pwd.value = '';
            login_hidepwd.value = '';     
    },
    showPsw(){
       const login_pwd = this.$refs.login_pwd;//将password的值传给text 
       const login_hidepwd = this.$refs.login_hidepwd;
       const show_password = this.$refs.show_password;
       const hide_password = this.$refs.hide_password;
       login_hidepwd.value = login_pwd.value;
        hide_password.style.display = "block";    
        show_password.style.display = "none";    
    },
    hidePsw(){
        const show_password = this.$refs.show_password;
        const hide_password = this.$refs.hide_password;
        hide_password.style.display = "none";    
        show_password.style.display = "block";  
    }
  },
    mounted: function () {
        var getUser = localStorage.getItem("userName");
        if(getUser){
            this.userName = getUser;
        }else{
            this.userName = ''
        }
        $('.two').get(0).addEventListener('input', function () {
            if($('.one').val()!=''){
                if($('.two').val()!=''){
                $('.submit_login').addClass('active')
                }
            }

        })
    }
}
</script>