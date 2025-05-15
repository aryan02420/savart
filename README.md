## Getting Started

Tools required to build and run the project:

```bash
$ node --version
v22.14.0

$ pnpm --version
10.6.3

$ docker --version
Docker version 27.5.1-ce, build 4c9b3b011ae4

$ docker-compose --version
docker-compose version 1.29.2, build 5becea4c
```

Install dependencies

```bash
$ pnpm install

$ docker-compose -f docker-compose.dev.yml pull
```

Start the app

```bash
$ docker-compose -f docker-compose.dev.yml up

$ pnpm dev
```

Shut down the app

```bash
$ docker-compose -f docker-compose.dev.yml up
```

For production build

```bash
$ yarn build

$ cp .env.{development,production} # Or set these directly in you shell based on the values provided by vercel dashboard.

$ yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Differences from requirements

- Testing has not been integrated. Since majority of logic is dependent on 3rd party, for which testing does not make sense. Instead it would be preferable to rely on observability. Zod and browser assertions can be used to ensure the data we scrape is of the proper shape and log it accordingly.
- Search does not support ISIN. You can instead search based on company name or stock symbol. This should be easy to swap with some other API. The lookup record can also be generated based on data provided by NSDL (I could not find the one which also lists NSE/BSE symbols which are used by screener.in).
- Next js has been used in order to simplify deployment. Can be substituted for Vite based SPA, but I did not want to write a separate backend.

## Enhancements

- Better caching strategy. It would probably be ideal if we could display stale data while scraping for new one on the side.
- Better error handling and observability. Right now all errors are wrapped into a generic error with no context of what actually went wrong. On actual apps, I would prefer finer grained control over errors and also better logging for the same.
- Design lol.