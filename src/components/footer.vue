<style>
.footer{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 16px 0;
    border-top: 1px solid #ddd;
    background-color: #fff;
    display: -webkit-flex;
    display: flex;
}
.linkA{
    flex: 0.5;
    text-align: center;
    font-size: 20px;
    color: #333;
}

</style>

<template>
    <div class="footer">
        <router-link to="/statistics" class="linkA">
            <i class="iconfont" style="font-size: 44px;padding-top: 0.1rem">&#xe610;</i><br/>
            <i>首页</i>
        </router-link>
        <router-link to="/team" class="linkA" :style="{'display':show?'':'none'}">
            <i class="iconfont" style="font-size: 48px;">&#xe7e3;</i><br/>
            <i>我的团队</i>
        </router-link>
        <router-link to="/entering" class="linkA" :style="{'display':show?'none':''}">
            <i class="iconfont" style="font-size: 48px;">&#xe7e3;</i><br/>
            <i>开户</i>
        </router-link>
    </div>
</template>

<script>
    export default{
        data() {
            return {
                show:true
            }
        },
        props:[
            'roleName'
        ],
        created(){
            console.log(this.$props.roleName)
            const roleName = this.$props.roleName;
            if(roleName=='推广经理'){
                this.show = false;
            }else{
                this.show = true;
            }
        }
    }
</script>