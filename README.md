# ft-app

Fungible Token Fullstack Assessment

## What this does

Currently there is a Login (new users must be added through the DB directly). Login is handled through `Supabase Auth`, rather than connecting a wallet and going that route. There are RLS policies setup (authZ) so that users can only access their own data.

After login, users are presented with a screen that shows a list of the top 100 tokens (by Market Cap) from Coingecko's free API. Users are able to "favorite" any of those tokens and add them to or remove them from a watch list.

Tokens which are on the watchlist also have sparkline data from the last 7 days displayed.

## Architectural decisions

After spending most of the first day digging into what was possible to pull directly from the Solana blockchain, I realized there was too much for me to learn on my own and opted for the Coingecko API. Since I have recent experience with Supabase, I chose to go down that route for the data store, which also gave me auth out of the box, rather than attempting to integrate with a wallet as an auth provider (which I don't have experience with yet).

I opted to use a hybrid approach between client side state and server side storage, mostly to demonstrated that I can use either (although I'll admit, I'm not super happy with my approach yet!).

I chose Radix as the UI library, mostly because it was part of the stack, but also because it seemed to have everything I would need. I chose zustand as the client side state manager because it's awesome.

The Token list UI isn't superb - it should have a minimum height and should always take up as much vertical space as possible. But my focus was on getting a snappy UI with as quick of response times as possible over perfecting the layout size, given the time I had.

I also chose to use the NextJS proxy for calls to coingecko to avoid any CORS errors, which intermittently showed up.

If I had a week to work on this, I would look next at:

- Logging
- Error handling
- Integration with a wallet for authN
- What other data optimizations could be made
- More real-time data
- Animations last (but not to downplay the effect of innovative UX)

## Getting Started

To run all of this locally:

- Checkout this repo and run `npm i`. Everything should install without issue. :pray:

- Get supabase setup and running. We're basically going to follow the instructions straight from (supabase|[https://supabase.com/docs/guides/self-hosting/docker]), but we're going to use my supabase .env file instead of the `cp .env.example .env` command they want you to run. \*\*You may be able to just run `docker-compose up -d` from the `supabase` directory in this repo (I've used docker, never set it up myself). If that works, you're golden. Otherwise you will need to move the `.env` file from this repo's `supabase` directory into the `supabase` repo you checkout in their guide above (specifically, the `supabase/docker` directory) .

- After you have supabase setup, you'll want to take the `full_backup.sql` file (in the root of this directory) and restore the postgres DB in supabase. The postgres password is in that `.env` file mentioned previously.

- After running `npm run dev`, you'll access the app on `localhost:3000`. Your username is `hello@kinetic.xyz` and your password is `password`. Feel free to visit `localhost:8000` to access supabase and add other users, you'll just need to clear your browser cookie to log out. The credentials for supabase are also in the `.env` file.

Enjoy! Can't wait to talk about it.
