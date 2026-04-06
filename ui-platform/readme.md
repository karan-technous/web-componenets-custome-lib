ui-platform/
│
├── meta/
|     |── karan9186/ (cli)
├── scripts/
|     |── build-all.js
|     |── prepare-publish.js
|     |── publish-packages.js
├── test/
|     |── angular-test/
|     |── angular-test/
├── packages/
│
│   ├── angular/
│   │   ├── .angular/
│   │   ├── .vscode/
│   │   ├── dist/
│   │   ├── node_modules/
│   │   ├── projects/
│   │   │   └── ui-lib/
│   │   │       ├── src/
│   │   │       │   ├── lib/
│   │   │       │   │   ├── button/
│   │   │       │   │   │   ├── button.component.ts
│   │   │       │   │   │   └── button.component.html
│   │   │       │   │   │
│   │   │       │   │   ├── input/
│   │   │       │   │   │   ├── input.component.ts
│   │   │       │   │   │   └── input.component.html
│   │   │       │   │   │
│   │   │       │   │   ├── register-custom-elements.ts
│   │   │       │   │   ├── ui-lib.module.ts
│   │   │       │   │   ├── ui-lib.ts
│   │   │       │   │   └── ui-lib.spec.ts
│   │   │       │   │
│   │   │       │   └── public-api.ts
│   │   │       │
│   │   │       ├── ng-package.json
│   │   │       ├── package.json
│   │   │       ├── README.md
│   │   │       ├── tsconfig.lib.json
│   │   │       ├── tsconfig.lib.prod.json
│   │   │       └── tsconfig.spec.json
│   │   │
│   │   ├── angular.json
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── tsconfig.json
│   │   └── README.md
│
│   ├── core/
│   │   ├── dist/
│   │   ├── node_modules/
│   │   ├── src/
│   │   │   └── forms/
│   │   │       └── form-control.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│
│   ├── react/
│   │   ├── node_modules/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/ -> button.tsx and index.ts
│   │   │   │   └── Input/ -> input.tsx and index.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── web-components.d.ts
│   │   │   │
│   │   │   ├── index.ts
│   │   │   └── setup.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│
│   ├── web-components/
│   │   ├── .stencil/
│   │   ├── dist/
│   │   ├── loader/
│   │   ├── node_modules/
│   │   ├── src/
│   │   │   ├── index.html
│   │   │   ├── index.ts
│   │   │   ├── components.d.ts
│   │   │   ├── components/
│   │   │   │   ├── ui-button/
│   │   │   │   │   ├── ui-button.tsx
│   │   │   │   │   └── readme.md
│   │   │   │   │
│   │   │   │   ├── ui-input/
│   │   │   │   │   ├── ui-input.tsx
│   │   │   │   │   └── readme.md
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── utils.ts
│   │   │       └── utils.unit.test.ts
│   │   │
│   │   ├── stencil.config.ts
│   │   └── package.json
│   │   └── tsconfig.json
│   │   └── vitest-setup.json
│   │   └── vitest-config.json
│
├── package.json
└── pnpm-workspace.yaml