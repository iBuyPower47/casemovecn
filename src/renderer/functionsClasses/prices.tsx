import { ItemRow } from 'renderer/interfaces/items';
import { Prices, Settings } from 'renderer/interfaces/states';
import { pricing_add_to_requested } from 'renderer/store/actions/pricingActions';

export class ConvertPrices {
  settingsData: Settings;
  prices: Prices;

  constructor(settingsData: Settings, prices: Prices) {
    this.settingsData = settingsData;
    this.prices = prices;
  }

  _getName(itemRow: ItemRow) {
    return itemRow.item_name + (itemRow.item_wear_name || '');
  }

  getPrice(itemRow: ItemRow, nanToZero: true): number;
  getPrice(itemRow: ItemRow, nanToZero?: false): number | undefined;
  getPrice(itemRow: ItemRow, nanToZero = false): number | undefined {
    let price =
      this.prices.prices[this._getName(itemRow)]?.[
        this.settingsData.source.title
      ];

    const rate = this.settingsData.currencyPrice[this.settingsData.currency];

    let itemPrice: number | undefined;
    if (this.settingsData.source.title === 'buff163') {
      // buff163 价格单位是 CNY
      if (this.settingsData.currency === 'CNY') {
        itemPrice = price;
      } else if (price !== undefined && rate !== undefined) {
        // CNY → USD → 目标货币：price / CNY汇率 * 目标汇率
        const cnyRate = this.settingsData.currencyPrice['CNY'];
        itemPrice = cnyRate ? (price / cnyRate) * rate : undefined;
      } else {
        itemPrice = undefined;
      }
    } else {
      // steam 价格单位是 USD，乘以目标货币汇率
      itemPrice =
        price !== undefined && rate !== undefined ? price * rate : undefined;
    }

    if (nanToZero && (itemPrice === undefined || isNaN(itemPrice))) {
      return 0;
    }

    return itemPrice;
  }
}

export class ConvertPricesFormatted extends ConvertPrices {
  constructor(settingsData: Settings, prices: Prices) {
    super(settingsData, prices);
  }

  formatPrice(price: number | undefined) {
    if (price === undefined || !Number.isFinite(price)) {
      return '';
    }
    return new Intl.NumberFormat(this.settingsData.locale, {
      style: 'currency',
      currency: this.settingsData.currency,
    }).format(price);
  }

  getFormattedPrice(itemRow: ItemRow) {
    return this.formatPrice(this.getPrice(itemRow));
  }
  getFormattedPriceCombined(itemRow: ItemRow) {
    let comQty = itemRow?.combined_QTY as number;
    const price = this.getPrice(itemRow);
    if (price === undefined || !Number.isFinite(price)) {
      return '';
    }
    return new Intl.NumberFormat(this.settingsData.locale, {
      style: 'currency',
      currency: this.settingsData.currency,
    }).format(comQty * price);
  }
}

async function requestPrice(priceToGet: Array<ItemRow>) {
  window.electron.ipcRenderer.getPrice(priceToGet);
}

async function dispatchRequested(
  dispatch: Function,
  rowsToGet: Array<ItemRow>
) {
  dispatch(pricing_add_to_requested(rowsToGet));
}

export class RequestPrices extends ConvertPrices {
  dispatch: Function;
  constructor(dispatch: Function, settingsData: Settings, prices: Prices) {
    super(settingsData, prices);
    this.dispatch = dispatch;
  }

  _checkRequested(itemRow: ItemRow): boolean {
    return (
      this.prices.productsRequested.includes(this._getName(itemRow)) == false
    );
  }

  handleRequested(itemRow: ItemRow): void {
    const price = this.getPrice(itemRow);
    if (
      (price === undefined || isNaN(price)) &&
      this._checkRequested(itemRow)
    ) {
      let rowsToSend = [itemRow];
      requestPrice(rowsToSend);
      dispatchRequested(this.dispatch, rowsToSend);
    }
  }

  handleRequestArray(itemRows: Array<ItemRow>): void {
    let rowsToSend = [] as Array<ItemRow>;
    itemRows.forEach((itemRow) => {
      const price = this.getPrice(itemRow);
      if (
        (price === undefined || isNaN(price)) &&
        this._checkRequested(itemRow)
      ) {
        rowsToSend.push(itemRow);
      }
    });
    if (rowsToSend.length > 0) {
      requestPrice(rowsToSend);
      dispatchRequested(this.dispatch, rowsToSend);
    }
  }
}
