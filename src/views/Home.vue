<template>
  <div class="home">
    <modal @cancel="closeModal" :mode="modalMode" :title="modalTitle" v-if="modalShowing" @purchaseComplete="purchaseComplete"/>
    <div v-if="modalShowing" class="modal-shadow" style="opacity: 50%;"></div>
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
          <button class="primary" @click="scrollTo('campaigns')">View existing GruupBuys</button>
          <button class="primary" @click="scrollTo('table')">Start a GruupBuy</button>
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
    <div class="section-title" ref="campaigns">
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
                <span class="key">GruupBuy Organizer:</span><span class="value">{{campaign.organizer}}</span>
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
              {{getPercentQuantityAsString(campaign)}}% of Goal
            </div>
            <div class="join-button">
              <button @click="showModal('join', index)" class='secondary'>Join this GruupBuy</button>
              <div class="share">
                <img class="share-icon" src="https://assets.medinas.com/hackathon/share-icon.svg"/>
                <a href="mailto:" class="share-text">Share Campaign</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-title">
      GruupBuy Vetted Factories
    </div>
    <div class="table-container" ref="table">
      <div class="table-headers">
        <div class="th t-score">SCORE</div>
        <div class="th t-data">PRODUCT</div>
        <div class="th t-data">FACTORY NAME</div>
        <div class="th t-location">LOCATION</div>
        <div class="th t-lead-time">LEAD TIME</div>
        <div class="th t-unit">UNIT PRICE</div>
        <div class="th t-qty">MIN QTY</div>
        <div class="th t-data">PURCHASE</div>
      </div>
      <div v-for="(campaign, index) in availableCampaigns" :key="index" class="table-row">
        <div class="td t-score"><div class="score-square" :class="campaign.getScoreClass()">{{campaign.score}}</div></div>
        <div class="td t-product"><div class="product" :class="shouldBold(campaign) ? 'bold' : ''">{{campaign.campaignTitle}}</div><a :href="campaign.specificationLink" class="specifications" target="_blank">Product Specifications</a></div>
        <div class="td t-data" :class="shouldBold(campaign) ? 'bold' : ''">{{campaign.getFactoryName()}}</div>
        <div class="td t-location" :class="shouldBold(campaign) ? 'bold' : ''">{{campaign.getLocation()}}</div>
        <div class="td t-lead-time" :class="shouldBold(campaign) ? 'bold' : ''">{{campaign.getLeadTime()}}</div>
        <div class="td t-unit" :class="shouldBold(campaign) ? 'bold' : ''">{{campaign.getUnitPrice()}}</div>
        <div class="td t-qty" :class="shouldBold(campaign) ? 'bold' : ''">{{campaign.getMoq()}}</div>
        <div class="td t-data" :class="shouldBold(campaign) ? 'bold' : ''"><button @click="showModal('create', index)" class="secondary">Start A GruupBuy</button></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveCampaign from '@/classes/active-campaign'
import Campaign from '@/classes/campaign'
import Modal from '@/components/Modal.vue'
import { getRandomInt } from '@/classes/strings'

export default Vue.extend({
  name: 'Home',
  components: {
    Modal
  },
  data: () => {
    return {
      existingCampaigns: [] as ActiveCampaign[],
      availableCampaigns: [] as Campaign[],
      THREE_PLY_IMG_URL: 'https://assets.medinas.com/hackathon/3ply.jpg',
      KN_IMG_URL: 'https://assets.medinas.com/hackathon/KN95.jpg',
      SANITIZER_IMG_URL: 'https://assets.medinas.com/hackathon/sanitizer.jpg',
      THREE_PLY_PDF_URL: 'https://assets.medinas.com/hackathon/3-ply.pdf',
      KN_PDF_URL: 'https://assets.medinas.com/hackathon/KN95.pdf',
      SANITIZER_PDF_URL: 'https://assets.medinas.com/hackathon/hand-sanitizer.pdf',
      modalShowing: false,
      modalMode: 'create',
      modalTitle: '',
      modalIndex: -1,
      addresses: ['5201 Woodward Ave, Detroit, MI 48202', '121 Gratiot Ave, Detroit, MI 48226', '2507 W Grand Blvd, Detroit, MI 48208']
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

      const number = Math.round((qty / moq.value * 100) * 1e2) / 1e2
      return number
    },
    getPercentQuantityAsString (campaign: ActiveCampaign): string {
      const percentQuantity = this.getPercentQuantity(campaign)
      return percentQuantity.toString().split('.')[0]
    },
    formatProperString (input: string): string {
      let rval = input[0]
      rval = rval.toUpperCase()
      rval += input.slice(1, input.length)
      return rval
    },
    scrollTo (element: string): void {
      const refElement = this.$refs[element] as Element
      refElement.scrollIntoView(true)
    },
    showModal (mode: string, campaignIndex: number): void {
      let campaign: Campaign | ActiveCampaign | undefined
      if (mode === 'create') {
        campaign = this.availableCampaigns[campaignIndex]
      } else {
        campaign = this.existingCampaigns[campaignIndex]
      }

      this.modalMode = mode
      this.modalTitle = `${campaign.campaignTitle} from ${campaign.getFactoryName()}`
      this.modalShowing = true
      this.modalIndex = campaignIndex
    },
    closeModal (): void {
      this.modalShowing = false
    },
    purchaseComplete (args: {qty: string; name: string}): void {
      let campaign: Campaign | ActiveCampaign | undefined
      const quantity = parseInt(args.qty)
      if (this.modalMode === 'create') {
        campaign = this.availableCampaigns[this.modalIndex]
        this.existingCampaigns.push(ActiveCampaign.fromCampaign(campaign, 30, this.chooseARandomAddress(), args.name, quantity, campaign.unit === 'gallons'))
      } else {
        this.existingCampaigns[this.modalIndex].quantity += quantity
      }

      this.modalShowing = false
      this.scrollTo('campaigns')
    },
    chooseARandomAddress (): string {
      return this.addresses[getRandomInt(3)]
    },
    shouldBold (campaign: Campaign): boolean {
      return campaign.getLocation() === 'Detroit, MI'
    }
  },
  mounted () {
    const activeSurgicalCampaign = new ActiveCampaign(this.THREE_PLY_IMG_URL,
      '3-ply Surgical Masks',
      this.THREE_PLY_PDF_URL,
      [{ key: 'Factory Name', value: 'Orange Supplies, Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'MOQ', value: 30000 }, { key: 'Lead Time', value: '3 Days' }, { key: 'Unit Price', value: '$.90/mask' }],
      20,
      'masks',
      'A',
      12,
      '5201 Woodward Ave, Detroit, MI 48202',
      'Detroit Medical Supply, Inc',
      13500)

    const activeKnCampaign = new ActiveCampaign(this.KN_IMG_URL,
      'KN95 Masks',
      this.KN_PDF_URL,
      [{ key: 'Factory Name', value: 'Avocado, Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'MOQ', value: 5000 }, { key: 'Lead Time', value: '3 Days' }, { key: 'Unit Price', value: '$.90/mask' }],
      90,
      'masks',
      'A',
      20,
      '121 Gratiot Ave, Detroit, MI 48226',
      'Detroit Municipal Hospital',
      750)

    const activeSanitizerCampaign = new ActiveCampaign(this.SANITIZER_IMG_URL,
      'Hand Sanitizer',
      this.SANITIZER_PDF_URL,
      [{ key: 'Factory Name', value: 'Kiwi Supplies Inc' }, { key: 'Location', value: 'Anhui, China' }, { key: 'MOQ', value: 100 }, { key: 'Lead Time', value: '34 Days' }, { key: 'Unit Price', value: '$7.00/gallon' }],
      700,
      'gallon',
      'A',
      1,
      '2507 W Grand Blvd, Detroit, MI 48208',
      'Jeff\'s Coffee Cafe',
      100,
      true)

    this.existingCampaigns.push(activeSurgicalCampaign)
    this.existingCampaigns.push(activeKnCampaign)
    this.existingCampaigns.push(activeSanitizerCampaign)

    this.availableCampaigns.push(
      new Campaign(this.THREE_PLY_IMG_URL, '3 Ply Surgical Masks', this.THREE_PLY_PDF_URL, [{ key: 'Factory Name', value: 'Orange Supplies Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'Lead Time', value: '12 Days' }, { key: 'Unit Price', value: '$.20/mask' }, { key: 'MOQ', value: 30000 }], 20, 'mask', 'A')
    )

    this.availableCampaigns.push(
      new Campaign(this.THREE_PLY_IMG_URL, '3 Ply Surgical Masks', this.THREE_PLY_PDF_URL, [{ key: 'Factory Name', value: 'Grape Corp' }, { key: 'Location', value: 'San Diego, CA' }, { key: 'Lead Time', value: '14 Days' }, { key: 'Unit Price', value: '$.09/mask' }, { key: 'MOQ', value: 50000 }], 20, 'mask', 'C')
    )

    this.availableCampaigns.push(
      new Campaign(this.KN_IMG_URL, 'KN95 Mask', this.KN_PDF_URL, [{ key: 'Factory Name', value: 'Avocado Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'Lead Time', value: '3 Days' }, { key: 'Unit Price', value: '$.90/mask' }, { key: 'MOQ', value: 5000 }], 90, 'mask', 'B')
    )

    this.availableCampaigns.push(
      new Campaign(this.KN_IMG_URL, 'KN95 Mask', this.KN_PDF_URL, [{ key: 'Factory Name', value: 'Pear Manufacturing' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'Lead Time', value: '1 Day' }, { key: 'Unit Price', value: '$.79/mask' }, { key: 'MOQ', value: 30000 }], 79, 'mask', 'A')
    )

    this.availableCampaigns.push(
      new Campaign(this.SANITIZER_IMG_URL, 'Hand Sanitizer', this.SANITIZER_PDF_URL, [{ key: 'Factory Name', value: 'Kiwi Supplies Inc' }, { key: 'Location', value: 'Anhui, China' }, { key: 'Lead Time', value: '34 Days' }, { key: 'Unit Price', value: '$7.00/gallon' }, { key: 'MOQ', value: 30000 }], 700, 'gallon', 'C')
    )

    this.availableCampaigns.push(
      new Campaign(this.THREE_PLY_IMG_URL, '3 Ply Surgical Masks', this.THREE_PLY_PDF_URL, [{ key: 'Factory Name', value: 'Orange Supplies Inc' }, { key: 'Location', value: 'Detroit, MI' }, { key: 'Lead Time', value: '12 Days' }, { key: 'Unit Price', value: '$.20/mask' }, { key: 'MOQ', value: 30000 }], 20, 'mask', 'A')
    )
  }
})
</script>
<style lang="sass" scoped>
  @import '@/styles/home'
</style>
