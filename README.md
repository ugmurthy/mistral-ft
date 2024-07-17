# RunGenie - A FineTuned Mistral Model to help Amateur Runners

The development of `RunGenie` began as a project for the [Mistral.ai](https://mistral.ai/) Hackathon. Leveraging the **Fine Tuning API**, the project utilised both synthetic and crowd-sourced questions. These questions were answered by leading large language models (LLMs) including ChatGPT-4o, Mistral Large, Gemini Advanced, Llama3-70b, and some smaller models. The responses from these LLMs were compiled to create a robust dataset.

This dataset was then used to fine-tune an `open-mistral-7b` model, ensuring it was capable of providing expert advice on marathon coaching. The refined model was integrated into `RunGenie`, the front-end web app, to offer users easy access to personalised running guidance.

With RunGenie, runners can receive expert advice, motivational support, and tailored strategies to improve their performance and enjoy their running journey.

Note: RunGenie was earlier called MyCoach

[![RunGenie - A 2 minute video](https://img.youtube.com/vi/m-BHibMZJ5M.jpg)](https://www.youtube.com/watch?v=m-BHibMZJ5M)

### RunGenie App

Try out the App here:
The latest version with `quantitative` evaluation of model - could fail at times
[RunGenie App V0.10](https://mistral-ft.vercel.app/)

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
