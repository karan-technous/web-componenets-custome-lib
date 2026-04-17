# ui-panel



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                        | Type                                    | Default     |
| ------------- | ------------- | -------------------------------------------------- | --------------------------------------- | ----------- |
| `collapsible` | `collapsible` | Whether the panel is collapsible                   | `boolean`                               | `false`     |
| `disabled`    | `disabled`    | Whether the panel is disabled                      | `boolean`                               | `false`     |
| `expanded`    | `expanded`    | Expanded state (can be controlled or uncontrolled) | `boolean`                               | `true`      |
| `loading`     | `loading`     | Whether the panel is in loading state              | `boolean`                               | `false`     |
| `size`        | `size`        | Size of the panel                                  | `"lg" \| "md" \| "sm"`                  | `'md'`      |
| `variant`     | `variant`     | Visual variant of the panel                        | `"default" \| "elevated" \| "outlined"` | `'default'` |


## Events

| Event      | Description                              | Type                                  |
| ---------- | ---------------------------------------- | ------------------------------------- |
| `uiToggle` | Emitted when panel is expanded/collapsed | `CustomEvent<PanelToggleEventDetail>` |


## Methods

### `collapse() => Promise<void>`

Collapse the panel

#### Returns

Type: `Promise<void>`



### `expand() => Promise<void>`

Expand the panel

#### Returns

Type: `Promise<void>`



### `toggle() => Promise<void>`

Toggle the panel expand/collapse state

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
