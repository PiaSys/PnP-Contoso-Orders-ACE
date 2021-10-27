import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ManageOrdersAdaptiveCardExtensionStrings';
import { IManageOrdersAdaptiveCardExtensionProps, IManageOrdersAdaptiveCardExtensionState } from '../ManageOrdersAdaptiveCardExtension';

export interface IErrorQuickViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class ErrorQuickView extends BaseAdaptiveCardView<
  IManageOrdersAdaptiveCardExtensionProps,
  IManageOrdersAdaptiveCardExtensionState,
  IErrorQuickViewData
> {
  public get data(): IErrorQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.state.description
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ErrorQuickViewTemplate.json');
  }
}