# ui-tooltip



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                                     | Default     |
| ---------- | ---------- | ----------- | ---------------------------------------- | ----------- |
| `content`  | `content`  |             | `string`                                 | `undefined` |
| `delay`    | `delay`    |             | `number`                                 | `150`       |
| `disabled` | `disabled` |             | `boolean`                                | `false`     |
| `open`     | `open`     |             | `boolean`                                | `undefined` |
| `position` | `position` |             | `"bottom" \| "left" \| "right" \| "top"` | `'top'`     |
| `trigger`  | `trigger`  |             | `"click" \| "focus" \| "hover"`          | `'hover'`   |
| `variant`  | `variant`  |             | `"complex" \| "simple"`                  | `'simple'`  |


## Events

| Event        | Description | Type                   |
| ------------ | ----------- | ---------------------- |
| `openChange` |             | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [ui-tabs](../ui-tabs)

### Graph
```mermaid
graph TD;
  ui-tabs --> ui-tooltip
  style ui-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
