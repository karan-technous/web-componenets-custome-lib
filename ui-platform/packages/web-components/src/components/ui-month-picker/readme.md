# ui-month-picker



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type      | Default          |
| -------------- | --------------- | ----------- | --------- | ---------------- |
| `disabled`     | `disabled`      |             | `boolean` | `false`          |
| `errorMessage` | `error-message` |             | `string`  | `undefined`      |
| `maxYear`      | `max-year`      |             | `number`  | `2100`           |
| `minYear`      | `min-year`      |             | `number`  | `2000`           |
| `placeholder`  | `placeholder`   |             | `string`  | `'Select month'` |
| `required`     | `required`      |             | `boolean` | `false`          |
| `value`        | `value`         |             | `string`  | `undefined`      |


## Events

| Event         | Description | Type                  |
| ------------- | ----------- | --------------------- |
| `valueChange` |             | `CustomEvent<string>` |


## Dependencies

### Depends on

- [ui-input](../ui-input)
- [ui-dropdown](../ui-dropdown)

### Graph
```mermaid
graph TD;
  ui-month-picker --> ui-input
  ui-month-picker --> ui-dropdown
  ui-input --> ui-icon
  ui-dropdown --> ui-input
  ui-dropdown --> ui-icon
  ui-dropdown --> ui-spinner
  ui-dropdown --> ui-checkbox
  ui-checkbox --> ui-icon
  style ui-month-picker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
