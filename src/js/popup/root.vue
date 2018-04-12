<template>
<<<<<<< HEAD
  <section>
    <div>
      <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <!-- <div> -->
                <!-- <span class="dashboard-clock">24:59</span> -->
              <!-- </div> -->
            

              <el-row>
                <el-button type="success" icon="el-icon-play" @click="onHandler">开始</el-button>
                <el-button type="danger" icon="el-icon-stop" @click="offHandler">终止</el-button>
              </el-row>
            </div>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <a href="/pages/options.html" target="_blank" role="button">选项</a>
          </div>
        </el-col>
      </el-row>
    </div>

    <div>



    </div>
  </section>
</template>

<style>
section {
  width: 400px;
}

.dashboard-clock {
  font-size: 20px
}


</style>

=======
  <div>
      <h1>Root page</h1>
      <p>
          <router-link :to="{name: 'home'}">Home</router-link>
          <router-link :to="{name: 'setting'}">Setting</router-link>
      </p>

      <router-view></router-view>
  </div>
</template>

>>>>>>> 36c7b6b62e87238749090026ec064d98e3aa7ecc
<script>
export default {
  data () {
      return {}
  }
}
</script>
