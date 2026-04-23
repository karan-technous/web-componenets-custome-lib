# ui-checkbox



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description | Type                   | Default |
| --------------- | --------------- | ----------- | ---------------------- | ------- |
| `checked`       | `checked`       |             | `boolean`              | `false` |
| `controlled`    | `controlled`    |             | `boolean`              | `false` |
| `disabled`      | `disabled`      |             | `boolean`              | `false` |
| `indeterminate` | `indeterminate` |             | `boolean`              | `false` |
| `label`         | `label`         |             | `string`               | `''`    |
| `size`          | `size`          |             | `"lg" \| "md" \| "sm"` | `'md'`  |


## Events

| Event      | Description | Type                      |
| ---------- | ----------- | ------------------------- |
| `uiBlur`   |             | `CustomEvent<void>`       |
| `uiChange` |             | `CustomEvent<boolean>`    |
| `uiClick`  |             | `CustomEvent<MouseEvent>` |


## Dependencies

### Used by

 - [ui-checkbox-dropdown](../ui-checkbox-dropdown)
 - [ui-dropdown](../ui-dropdown)

### Depends on

- [ui-icon](../ui-icon)

### Graph
```mermaid
graph TD;
  ui-checkbox --> ui-icon
  ui-checkbox-dropdown --> ui-checkbox
  ui-dropdown --> ui-checkbox
  style ui-checkbox fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
