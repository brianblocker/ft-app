# ft-app

Fungible Token Fullstack Assessment

## Thoughts Log

I intend to use this section as a running list of my thoughts, to give sort of a "journey of my brain" along the way. Maybe this will be useful in an evaluation of "why did Blocker choose X over Y? Why is Z setup like this?" Cheer!

#### 2025-03-25T13:14:48Z Initial Thoughts

Starting this project. I haven't ever personally setup Docker or NextJS, so those might be where I spend a little bit more of my "spin my wheels time." I'm certain there are scripts/recipes to setup both of those so I don't need to reinvent anything there. I'll probably hold off setting up Docker for now, even though that does go against my personal view of "get v0 of the thing able to deploy and then iterate from there." I'm going to use Cursor as my IDE and definitely will leverage AI to speed up some things.

For the back-end, I'd like to show off NestJS and may do that with the Fastify adapter (although I've only ever set it up with the Express adapter, so that may eat up some time). I'll need to think through if the juice is worth the setup squeeze there. I may just use a vanilla Fastify setup and not worry so much about how it's organized. Plus, if somebody is evaluating this and they've never seen NestJS, they're going to be confused looking at it and that's definitely not what I'm going for here. I probably _won't_ go down the path of leveraging GraphQL at this time, for the following reasons:

- In my initial conversation with Keith, we discussed the value of the OpenAPI spec, and I'd like to demonstrate that a bit more than GraphQL (which, admittedly, I'm not super experienced with)
- I don't think this initial project is going to leverage much of what GraphQL is good for, so I don't _think_ that will be worth it. Maybe I discover I'm wrong. Or maybe I'm just wrong.

For some of the performance concerns, I'm thinking there probably exists somewhere publicly:

- An API to retrieve a list of tokens, potentially filterable, but hopefully at least sortable by Market Cap
- An API to retrieve metadata about a specific token - this means I'm probably going to end up looping through a list and executing a bunch of async calls, so I'll want to think through performance there. Probably something like "only loop through things that are _actually_ displayed on the screen + a few on either side of the visible list."

There may or may not need to exist some sort of cache layer. React Query takes care of some of that, but might need to consider another layer beyond that if performance is horrible

If we're watching certain tokens and we want to "subscribe" to changes on those tokens, this is probably where websockets will come into play. And we'll probably want to make sure we're subscribed _only_ to things visible on the screen. I'll think through that when we're there.

In order to bias towards speed of delivery, I'll probably hold off on any animations for now and add those after I feel good about the core functionality. I'm also still new to Tailwind, so how I've done animations in the past could be outdated and I'm going to have to spend some cycles looking into it. So unless AI can just do those animations correctly right out of the gate, I'll hold off.

Final thought - I'm going to run these initial thoughts through the Cursor AI chat and just see what it comes back with. Maybe it will give me back something quickly that can speed things up.

Here we go.

#### 2025-03-25T17:58:55Z Investigation Update

So I have NextJS up and running, I investigated a little bit about where to find the holistic list of all Tokens on a given platform. I wasn't able to figure out immediately how to do this directly from Solana's network, but coingecko _does_ have a free API (rate limited) that will return all 17k+ tokens they are aware of. Filtering this down to _just_ the tokens available on the solana platform returned almost 4k results, so that's better.

At this point I think it would make sense to implement some sort of cache for that data, maybe even store it (no idea if this violates their API terms, but we can address that later). Also, to note, it looks like it's possible to have a token with a space character or unicode as the symbol. No thoughts yet on how I would represent that but looks like those are going to have to be accounted for. May consider intentionally ignoring those for now to save on time and revisit later.

From a UX perspective, there could be new tokens added all the time that we need some method of being able to either:

1. Be made aware of new tokens automagically in the background, or
2. Allow users to search for a token (and add it to our database if it doesn't exist)

Now that I do have a starting point for a list of tokens at least, I should be able to start getting info straight from Solana with a given token's address. So we're on to something here.

## Next Stuff

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
