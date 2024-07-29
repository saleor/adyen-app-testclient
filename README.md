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
```

Run dev server via:

```shell
pnpm dev
```

## Using with other environments

1. Make sure you added deployment URL to allowed client hosts in Adyen app configuration & Adyen Dashboard
2. Check url structure below on how to supply your own data:
   - `<BASE_URL>/env/<ENV_URL>/checkout/<CHECKOUT_ID>/` goes to details of checkout (shipping & billing sections)
   - `<BASE_URL>/env/<ENV_URL>/checkout/<CHECKOUT_ID>/payment-gateway` allows you to select payment gateway
   - `<BASE_URL>/env/<ENV_URL>/checkout/<CHECKOUT_ID>/payment-gateway/<GATEWAY_ID>` renders Adyen drop-in component
   - `<BASE_URL>/env/<ENV_URL>/checkout/<CHECKOUT_ID>/payment-gateway/<GATEWAY_ID>/summary` shows checkout summary and allows to create an order

Variables used in point 2:

- `BASE_URL` is deployment or your local url e.g localhost:3000
- `ENV_UR` is encoded url to your environment (must end with `/graphql/`)
- `CHECKOUT_ID` is id of checkout you want to use
- `GATEWAY_ID` is id of Adyen app e.g app.saleor.adyen
