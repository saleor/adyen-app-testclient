# Adyen app testclient

This repository contains code for example testclient that should be used with [Adyen app](https://github.com/saleor/saleor-app-payment-adyen). It allows to create & complete checkout while paying with Adyen.

## How to get started

Install the dependencies by running the following command in the shell:

```shell
pnpm install
```

Create `.env.local` file with:

```
NEXT_PUBLIC_INITIAL_ENV_URL= # url of your env (must end with /graphql/)
NEXT_PUBLIC_INITIAL_CHANNEL_SLUG= # in the most cases it will be default-channel
NEXT_PUBLIC_LOG_LEVEL= # one of info, warn or error. Defaults to info
```

Run dev server via:

```shell
pnpm dev
```

## Recommended VSCode settings

Create `settings.json` under `.vscode` folder with:

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": "on"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "workbench.editor.customLabels.patterns": {
    "**/app/**/page.tsx": "${dirname} - page.tsx",
    "**/app/**/layout.tsx": "${dirname} - layout.tsx",
    "**/app/**/error.tsx": "${dirname} - error.tsx",
    "**/app/**/loading.tsx": "${dirname} - loading.tsx"
  }
}
```

## Using with other environments

Make sure you added deployment URL to `allowed client hosts` in Adyen app configuration & Adyen Dashboard

Check table below with possible URL paths and how you can supply your own data:

| Path                                                                         | Location                                             |
| ---------------------------------------------------------------------------- | ---------------------------------------------------- |
| `/env/<ENV_URL>/checkout/<CHECKOUT_ID>/`                                     | Details of checkout (shipping & billing sections)    |
| `/env/<ENV_URL>/checkout/<CHECKOUT_ID>/payment-gateway/`                     | Allows you to select payment gateway                 |
| `/env/<ENV_URL>/checkout/<CHECKOUT_ID>/payment-gateway/<GATEWAY_ID>/`        | Renders Adyen drop-in component                      |
| `/env/<ENV_URL>/checkout/<CHECKOUT_ID>/payment-gateway/<GATEWAY_ID>/summary` | Shows checkout summary and allows to create an order |

Variables used in table:

- `ENV_UR` is encoded url to your environment (must end with `/graphql/`)
- `CHECKOUT_ID` is id of checkout you want to use
- `GATEWAY_ID` is id of Adyen app e.g app.saleor.adyen
