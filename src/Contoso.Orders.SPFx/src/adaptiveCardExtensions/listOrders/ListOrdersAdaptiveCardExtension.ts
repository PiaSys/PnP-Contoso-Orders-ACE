import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ListOrdersPropertyPane } from './ListOrdersPropertyPane';
import { Order } from '../../services/Order';
import * as strings from 'ListOrdersAdaptiveCardExtensionStrings';
import { DisplayMode } from '@microsoft/sp-core-library';
import { AadHttpClient } from '@microsoft/sp-http';

export interface IListOrdersAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  serviceBaseUrl: string;
}

export interface IListOrdersAdaptiveCardExtensionState {
  description: string;
  orders?: Order[];
}

const CARD_VIEW_REGISTRY_ID: string = 'ListOrders_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ListOrders_QUICK_VIEW';

export default class ListOrdersAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IListOrdersAdaptiveCardExtensionProps,
  IListOrdersAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ListOrdersPropertyPane | undefined;
  private aadClient: AadHttpClient;

  public async onInit(): Promise<void> {
    this.state = {
      description: strings.LoadingMessage
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    // Create the AadHttpClient instance for the back-end API via aadHttpClientFactory
    this.aadClient = await this.context.aadHttpClientFactory.getClient("api://pnp.contoso.orders");

    setTimeout(this.loadOrders, 500);

    return Promise.resolve();
  }

  private loadOrders = async () => {

    // Skip in case we are missing settings
    if (this.properties.serviceBaseUrl === undefined || this.properties.serviceBaseUrl.length == 0)
    {
      if (this.displayMode == DisplayMode.Edit) {
        this.context.propertyPane.open();
      }
      else {
        this.setState({
          description: strings.ConfigureMessage
        })
      }
    }
    else
    {
      // Load the requested symbols
      const symbols: string[] = this.properties.symbols.split(",");

      // Configure the initial/default symbol
      let symbol = symbols[0];

      // Determine what the next symbol is
      if (this.state.symbol !== '') {
        const currentSymbolIndex: number = symbols.indexOf(this.state.symbol);
        symbol = symbols[currentSymbolIndex < (symbols.length - 1) ? currentSymbolIndex + 1 : 0];
      }

      // Get the actual quote of the current symbol
      const httpResponse = await this.aadClient.get(`${this.properties.quoteServiceUrl}&symbol=${symbol}`,
      AadHttpClient.configurations.v1);
      const stockInfo: StockQuoteInfo = await httpResponse.json();

      this.setState({
        symbol: stockInfo.symbol,
        quote: stockInfo.quote,
        trend: stockInfo.trend
      });

      console.log(`Stock quote request for ${stockInfo.user}`);
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'ListOrders-property-pane'*/
      './ListOrdersPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ListOrdersPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
