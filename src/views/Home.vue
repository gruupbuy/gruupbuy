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
        <div class="right-content">View existing GruupBuys to see if anyone is running a campaign for the supplies you need.</div>
        <div class="right-content">- OR -</div>
        <div class="right-content">View vetted factories below and start a new group buy.</div>
      </div>
    </div>
    <div class="section-title">
      Existing GruupBuy Campaigns
    </div>
    <div class="active-campaigns">
      <div class="campaign" v-for="(campaign, index) in existingCampaigns" :key="index">
        <div class="campaign-column-left">
          <div class="campaign-title">
            <div class="title">{{getCampaignMoq(campaign)}}{{`${campaign.shouldIncludeUnitsInTitle ? ` ${formatProperString(campaign.unit)}s` : ''} `}}{{` ${campaign.campaignTitle}`}} from {{` ${getFactoryName(campaign)}`}}</div>
            <div class="days-left" :class="`${campaign.daysLeft === 1 ? 'red' : ''}`">{{campaign.daysLeft}} Days Left</div>
          </div>
          <div class="progress-container">
            <progress max="100" :value="getPercentQuantity(campaign)"></progress>
          </div>
          <div class="info-row">
            <div class="image-container">
              <img class="info-image" :src="campaign.imageUrl" />
            </div>
            <div class="info-container">
              <div class="info-data">
                <span class="key">GruupBuy Organizer</span><span class="value">{{campaign.organizer}}</span>
              </div>
              <div v-for="(data, index) in campaign.campaignData" :key="index" class="info-data">
                <span class="key">{{`${data.key}:`}}</span><span class="value">{{formatNumber(data.value)}}<div v-if="index === 0" class="specifications">(<a :href="campaign.specificationLink" target="_blank">Product Specifications</a>)</div></span>
              </div>
              <div class="info-data">
                <span class="key">Pick Up Location:</span><span class="value">{{campaign.pickUpLocation}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="campaign-column-right">
          <div class="ccr-row">
            <div class="progress-percent">
              {{getPercentQuantity(campaign)}}% of Goal
            </div>
            <div class="join-button">
              <button class='secondary'>Join this GruupBuy</button>
            </div>
          </div>
          <div class="ccr-row">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveCampaign from '@/classes/active-campaign'
import Campaign from '@/classes/campaign'

export default Vue.extend({
  name: 'Home',
  data: () => {
    return {
      existingCampaigns: [] as ActiveCampaign[]
    }
  },
  methods: {
    formatNumber (value: number | string): string {
      if (typeof value === 'string') {
        return value
      }
      return Intl.NumberFormat().format(value)
    },
    getCampaignMoq (campaign: Campaign): string {
      const moq = campaign.campaignData.find((data) => data.key === 'MOQ') as {key: string; value: number}
      return this.formatNumber(moq.value)
    },
    getFactoryName (campaign: Campaign): string {
      const factoryName = campaign.campaignData.find((data) => data.key === 'Factory Name') as {key: string; value: string}
      return factoryName.value
    },
    getPercentQuantity (campaign: ActiveCampaign): number {
      const qty = campaign.quantity
      const moq = campaign.campaignData.find((data) => data.key === 'MOQ') as {key: string; value: number}

      const number = qty / moq.value * 100
      return number
    },
    formatProperString (input: string): string {
      let rval = input[0]
      rval = rval.toUpperCase()
      rval += input.slice(1, input.length)
      return rval
    }
  },
  mounted () {
    const activeSurgicalCampaign = new ActiveCampaign('https://assets.medinas.com/hackathon/3ply.jpg',
      '3-ply Surgical Masks',
      'https://assets.medinas.com/hackathon/3-ply.pdf',
      [{ key: 'Factory Name', value: 'Orange Supplies, Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'MOQ', value: 30000 }, { key: 'Lead Time', value: '3 Days' }, { key: 'Unit Price', value: '$.90/mask' }],
      20,
      'masks',
      12,
      '5201 Woodward Ave, Detroit, MI 48202',
      'Detroit Medical Supply, Inc',
      13500)

    const activeKnCampaign = new ActiveCampaign('https://assets.medinas.com/hackathon/KN95.jpg',
      'KN95 Masks',
      'https://assets.medinas.com/hackathon/KN95.pdf',
      [{ key: 'Factory Name', value: 'Avocado, Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'MOQ', value: 5000 }, { key: 'Lead Time', value: '3 Days' }, { key: 'Unit Price', value: '$.90/mask' }],
      90,
      'masks',
      20,
      '121 Gratiot Ave, Detroit, MI 48226',
      'Detroit Municipal Hospital',
      750)

    const activeSanitizerCampaign = new ActiveCampaign('https://assets.medinas.com/hackathon/sanitizer.jpg',
      'Hand Sanitizer',
      'https://assets.medinas.com/hackathon/hand-sanitizer.pdf',
      [{ key: 'Factory Name', value: 'Kiwi Supplies Inc' }, { key: 'Location', value: 'Anhui, China' }, { key: 'MOQ', value: 100 }, { key: 'Lead Time', value: '34 Days' }, { key: 'Unit Price', value: '$7.00/gallon' }],
      700,
      'gallon',
      1,
      '2507 W Grand Blvd, Detroit, MI 48208',
      'Jeff\'s Coffee Cafe',
      100,
      true)

    this.existingCampaigns.push(activeSurgicalCampaign)
    this.existingCampaigns.push(activeKnCampaign)
    this.existingCampaigns.push(activeSanitizerCampaign)
  }
})
</script>
<style lang="sass" scoped>
  @import '@/styles/home'
</style>
