import Campaign from './campaign'

export default class ActiveCampaign extends Campaign {
  constructor (public imageUrl: string, public campaignTitle: string, public specificationLink: string, public campaignData: {key: string; value: string | number}[], public unitPriceInCents: number, public unit: string, public daysLeft: number, public pickUpLocation: string, public organizer: string, public quantity: number, public shouldIncludeUnitsInTitle = false) {
    super(imageUrl, campaignTitle, specificationLink, campaignData, unitPriceInCents, unit)
  }

  fromCampaign (campaign: Campaign, daysLeft: number, pickUpLocation: string, organizer: string, quantity: number, shouldIncludeUnitsInTitle = false): ActiveCampaign {
    return new ActiveCampaign(campaign.imageUrl, campaign.campaignTitle, campaign.specificationLink, campaign.campaignData, campaign.unitPriceInCents, campaign.unit, daysLeft, pickUpLocation, organizer, quantity, shouldIncludeUnitsInTitle)
  }
}
