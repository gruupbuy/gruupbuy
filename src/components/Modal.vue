<template>
  <div class="modal">
      <div class="cancel-row">
          <div @click="closeModal" class="cancel-button">X</div>
      </div>
      <div class="modal-title">
          {{`${mode === 'create' ? 'Start' : 'Join'}`}} a GruupBuy
      </div>
      <div class="modal-subtitle">{{title}}</div>
      <div class="modal-info">If your campaign doesn't hit its minimum order quantity goal, you'll be refunded 100% of your funds.</div>
      <div class="input-section">
          <div class="input-title">
              Your Name
          </div>
          <div class="input-value">
              <input type="text" v-model="name" :class="name.length > 0 ? 'empty' : ''">
          </div>
      </div>
      <div class="input-section">
          <div class="input-title">
              Business Name (Optional)
          </div>
          <div class="input-value">
              <input type="text" v-model="businessName" :class="businessName.length > 0 ? 'empty' : ''">
          </div>
      </div>
      <div class="input-section">
          <div class="input-title">
              Quantity you want to purchase
          </div>
          <div class="input-value">
              <input type="number" v-model="quantity" :class="quantity.length > 0 ? 'empty' : ''">
          </div>
      </div>
      <div class="input-section">
          <div class="input-title">
              Credit Card Number
          </div>
          <div class="input-value">
              <input type="text" v-model="ccNumber" :class="ccNumber.length > 0 ? 'empty' : ''">
          </div>
      </div>
      <div class="bottom-section">
          <div class="input-section-horizontal">
            <div class="input-title">
                Expiration Date
            </div>
            <div class="input-value exp-date">
                <input type="text" class="exp-date-input" v-model="expDate" :class="expDate.length > 0 ? 'exp-empty' : ''">
            </div>
          </div>
          <div class="input-section-horizontal">
            <div class="input-title">
                CVV
            </div>
            <div class="input-value cvv">
                <input type="text" class="cvv-width-input" v-model="cvv" :class="cvv.length > 0 ? 'cvv-empty' : ''">
            </div>
          </div>
          <div class="input-section-horizontal">
            <div class="input-title">
                ZIP
            </div>
            <div class="input-value zip">
                <input type="text" class="zip-width-input" v-model="zip" :class="zip.length > 0 ? 'zip-empty' : ''">
            </div>
          </div>
      </div>
      <div class="checkbox-row">
        <input type="checkbox">
        <div class="checkbox-label">Donate 5% of your order to charity</div>
      </div>
      <div class="button-row">
        <button @click="completePurchase()" class="primary extra-padding">Complete Purchase</button>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
  props: ['mode', 'title'],
  data: () => {
    return {
      name: '',
      businessName: '',
      quantity: 0,
      ccNumber: '',
      expDate: '',
      cvv: '',
      zip: ''
    }
  },
  methods: {
    closeModal (): void {
      this.$emit('cancel')
    },
    completePurchase (): void {
      this.$emit('purchaseComplete', { qty: this.quantity, name: this.name })
    }
  }
})
</script>
<style lang="sass" scoped>
@import '@/styles/modal'
</style>
