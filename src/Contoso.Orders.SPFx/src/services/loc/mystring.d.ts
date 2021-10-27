declare interface IOrderServiceStrings {
  ErrorNullArgument: string;
  ErrorCannotFindOrder: string;
  ErrorRetrievingOrder: string;
  ErrorRetrievingOrders: string;
  ErrorAddingOrder: string;
  ErrorUpdatingOrder: string;
  ErrorDeletingOrder: string;
}

declare module 'OrderServiceStrings' {
  const strings: IOrderServiceStrings;
  export = strings;
}
