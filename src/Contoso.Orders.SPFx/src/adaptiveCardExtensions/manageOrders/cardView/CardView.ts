import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ManageOrdersAdaptiveCardExtensionStrings';
import { 
  IManageOrdersAdaptiveCardExtensionProps, 
  IManageOrdersAdaptiveCardExtensionState, 
  ADDORDER_QUICK_VIEW_REGISTRY_ID,
  LISTORDERS_QUICK_VIEW_REGISTRY_ID
} from '../ManageOrdersAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IManageOrdersAdaptiveCardExtensionProps, IManageOrdersAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.ListOrdersQuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: LISTORDERS_QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      {
        title: strings.AddOrderQuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: ADDORDER_QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: strings.PrimaryText
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://aka.ms/m365pnp'
      }
    };
  }
}
