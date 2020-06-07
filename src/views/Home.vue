<template>
  <div class="home">
    <div class="headerbar">
      <div class="button-bar">
        <button class="secondary">Login / Sign Up</button>
      </div>
      <div class="logo-bar">
        <img src="../assets/gruupbuy.svg"/>
      </div>
    </div>
    <div class="info">
      <div class="left-column-content">
        <div class="title">DETROIT LOCAL BUSINESS</div>
        <div class="big-description">Leverage group purchasing power to get supplies you need at the best prices.</div>
        <div class="buttons">
          <button class="primary">View existing GruupBuys</button>
          <button class="primary">Start a GruupBuy</button>
        </div>
      </div>
      <div class="right-column-content">
        <div class="right-content">
          GruupBuy allows you to join forces with other local businesses in Detroit to meet factory set minimum order quantites (MOQs) leveraging your group purchasing power to get the best
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Home'
})
</script>
<style lang="sass" scoped>
  @import '@/styles/home'
</style>
