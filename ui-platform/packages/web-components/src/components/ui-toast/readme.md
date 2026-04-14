# ui-toast



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type      | Default     |
| ----------------- | ------------------ | ----------- | --------- | ----------- |
| `defaultDuration` | `default-duration` |             | `number`  | `undefined` |
| `maxVisible`      | `max-visible`      |             | `number`  | `undefined` |
| `pauseOnHover`    | `pause-on-hover`   |             | `boolean` | `undefined` |
| `stackGap`        | `stack-gap`        |             | `number`  | `undefined` |
| `swipeDismiss`    | `swipe-dismiss`    |             | `boolean` | `undefined` |


## Events

| Event        | Description | Type                                |
| ------------ | ----------- | ----------------------------------- |
| `toastClose` |             | `CustomEvent<ToastLifecycleDetail>` |
| `toastShow`  |             | `CustomEvent<ToastLifecycleDetail>` |


## Methods

### `dismiss(id?: string) => Promise<void>`



#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` |             |

#### Returns

Type: `Promise<void>`



### `show(options: ToastShowOptions) => Promise<string>`



#### Parameters

| Name      | Type               | Description |
| --------- | ------------------ | ----------- |
| `options` | `ToastShowOptions` |             |

#### Returns

Type: `Promise<string>`




## Dependencies

### Depends on

- [ui-icon](../ui-icon)

### Graph
```mermaid
graph TD;
  ui-toast --> ui-icon
  style ui-toast fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
