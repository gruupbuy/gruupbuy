export default class Campaign {
  constructor (public imageUrl: string, public campaignTitle: string, public specificationLink: string, public campaignData: {key: string; value: string | number}[], public unitPriceInCents: number, public unit: string) {
    // Some things here
  }
}
