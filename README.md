# MyCoach - A FineTuned Mistral Model to help Amateur Runners

MyCoach is **Amateur Runner Friendly** ChatBot that answers any question related to running and allied topics

Here are some broad topic it can deal with - in it's own words:
As a Marathon Coach, I can help you with various aspects of running, including nutrition, strength and mental training, musculoskeletal system, motivational strategies, and racing strategies. I can provide you with tips, advice, and guidance to help you improve your running performance and achieve your goals. Whether you’re a beginner just starting out or an experienced runner looking to take your training to the next level, I’m here to help. Let me know how I can assist you!

Here is a two minute Video

[![MyCoach](https://img.youtube.com/vi/vQ6d4GGbrWE/0.jpg)](https://www.youtube.com/watch?v=vQ6d4GGbrWE)

## FineTuning

## Set up a Development Environment

1. Clone this repo

Install Run the Vite dev server:

```shellscript
pnpm install
pnpm run dev
```

## Deployment to Vercel

Note: This assumes you have a VERCEL account and have already connect your repo to VERCEL.
For details look [here](https://vercel.com/docs/deployments/git)

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
