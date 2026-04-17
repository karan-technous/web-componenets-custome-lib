# ui-badge



<!-- Auto Generated Below -->


## Overview

UI Badge Component
Modern badge component with multiple variants, colors, and sizes
Supports icon slot, dot mode, and removable functionality

## Properties

| Property    | Attribute   | Description                                | Type                                                           | Default     |
| ----------- | ----------- | ------------------------------------------ | -------------------------------------------------------------- | ----------- |
| `color`     | `color`     | Color theme of the badge                   | `"danger" \| "neutral" \| "primary" \| "success" \| "warning"` | `'primary'` |
| `disabled`  | `disabled`  | Disable the badge                          | `boolean`                                                      | `false`     |
| `dot`       | `dot`       | Show as a dot indicator (status indicator) | `boolean`                                                      | `false`     |
| `removable` | `removable` | Show remove button                         | `boolean`                                                      | `false`     |
| `shape`     | `shape`     | Shape of the badge                         | `"pill" \| "rounded"`                                          | `'rounded'` |
| `size`      | `size`      | Size of the badge                          | `"lg" \| "md" \| "sm"`                                         | `'md'`      |
| `variant`   | `variant`   | Visual style variant of the badge          | `"outline" \| "soft" \| "solid"`                               | `'solid'`   |


## Events

| Event    | Description                               | Type                |
| -------- | ----------------------------------------- | ------------------- |
| `remove` | Emitted when the remove button is clicked | `CustomEvent<void>` |


## Slots

| Slot        | Description              |
| ----------- | ------------------------ |
| `"default"` | Badge content/text       |
| `"icon"`    | Icon slot for badge icon |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"base"`  |             |
| `"close"` |             |
| `"icon"`  |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
