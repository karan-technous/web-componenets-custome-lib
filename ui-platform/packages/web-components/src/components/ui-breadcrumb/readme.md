# ui-breadcrumb



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                       | Type      | Default     |
| --------------------- | ----------------------- | ------------------------------------------------- | --------- | ----------- |
| `disabled`            | `disabled`              | Whether the breadcrumb is disabled                | `boolean` | `false`     |
| `items`               | `items`                 | Breadcrumb items as JSON string                   | `string`  | `''`        |
| `itemsAfterCollapse`  | `items-after-collapse`  | Number of items to show after collapse indicator  | `number`  | `1`         |
| `itemsBeforeCollapse` | `items-before-collapse` | Number of items to show before collapse indicator | `number`  | `1`         |
| `maxItems`            | `max-items`             | Maximum number of items before collapsing         | `string`  | `undefined` |
| `separator`           | `separator`             | Separator between items                           | `string`  | `'slash'`   |


## Events

| Event     | Description                               | Type                                 |
| --------- | ----------------------------------------- | ------------------------------------ |
| `uiClick` | Emitted when a breadcrumb item is clicked | `CustomEvent<BreadcrumbEventDetail>` |


## Dependencies

### Depends on

- [ui-button](../ui-button)
- [ui-panel](../ui-panel)
- [ui-icon](../ui-icon)

### Graph
```mermaid
graph TD;
  ui-breadcrumb --> ui-button
  ui-breadcrumb --> ui-panel
  ui-breadcrumb --> ui-icon
  ui-button --> ui-icon
  style ui-breadcrumb fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
