import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ManageOrdersAdaptiveCardExtensionStrings';
import { IManageOrdersAdaptiveCardExtensionProps, IManageOrdersAdaptiveCardExtensionState } from '../ManageOrdersAdaptiveCardExtension';

export interface IConfirmQuickViewData {
  subTitle: string;
  title: string;
  description: string;
}

export class ConfirmQuickView extends BaseAdaptiveCardView<
  IManageOrdersAdaptiveCardExtensionProps,
  IManageOrdersAdaptiveCardExtensionState,
  IConfirmQuickViewData
> {
  public get data(): IConfirmQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      description: this.state.description
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ConfirmQuickViewTemplate.json');
  }
}