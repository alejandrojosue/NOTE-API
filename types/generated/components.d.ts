import type { Schema, Struct } from '@strapi/strapi';

export interface DetailsHistoryChange extends Struct.ComponentSchema {
  collectionName: 'components_details_history_changes';
  info: {
    displayName: 'historyChange';
    icon: 'stack';
  };
  attributes: {
    dateChange: Schema.Attribute.DateTime & Schema.Attribute.Required;
    newValue: Schema.Attribute.JSON & Schema.Attribute.Required;
    oldValue: Schema.Attribute.JSON & Schema.Attribute.Required;
    users_permissions_user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Required;
  };
}

export interface DetailsInvoiceDetail extends Struct.ComponentSchema {
  collectionName: 'components_details_invoice_details';
  info: {
    displayName: 'invoiceDetail';
    icon: 'bulletList';
  };
  attributes: {
    product: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Decimal & Schema.Attribute.Required;
    unitPrice: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'details.history-change': DetailsHistoryChange;
      'details.invoice-detail': DetailsInvoiceDetail;
    }
  }
}
