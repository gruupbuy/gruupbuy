import { convertPriceFromCentsToDollars, formatPrice } from './strings'

export default class Campaign {
  constructor (public imageUrl: string, public campaignTitle: string, public specificationLink: string, public campaignData: {key: string; value: string | number}[], public unitPriceInCents: number, public unit: string, public score: string) {
    // Some things here
  }

  private getDataValue (key: string): string | number {
    const data = this.campaignData.find((data) => data.key === key)
    return data!.value
  }

  getFactoryName (): string {
    return this.getDataValue('Factory Name') as string
  }

  getLocation (): string {
    return this.getDataValue('Location') as string
  }

  getLeadTime (): string {
    return `${this.getDataValue('Lead Time') as string} Days`
  }

  getUnitPrice (): string {
    return this.getDataValue('Unit Price') as string
  }

  getMoq (): string {
    return Intl.NumberFormat().format(this.getDataValue('MOQ') as number)
  }

  getScoreClass (): string {
    if (this.score === 'A') {
      return 'blue'
    } else if (this.score === 'B') {
      return 'yellow'
    } else {
      return 'red'
    }
  }
}
