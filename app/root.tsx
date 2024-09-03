import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  //LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import db from 'app/module/xata.server'
import { PageTransitionProgressBar } from './components/progress'
//import { getUser } from './modules/session/session.server';
import tailwindCSS from './tailwind.css?url'
import 'react-toastify/dist/ReactToastify.css';
//import { sleep } from './helpers/util';
//import Theme from './components/Theme';
import { getUser,  } from './module/session/session.server';
import { ToastContainer, Zoom } from 'react-toastify';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'RunGenie',
    },
    {
      property: 'og:title',
      content: 'RunGenie'
    },
    {
      property: 'og:description',
      content: 'RunGenie - A Personal Assistant for Recreational Runners'
    },
    {
      property: 'og:image',
      content: '/AI_Coach.png'
    },
    {
      property: 'og:url',
      content: 'https://rungenie.vercel.app'
    },
    {
      property: 'og:type',
      content: 'WebApp'
    },
    {
      name: 'description',
      content:
        'A Personal Assistant for Recreational Runners',
    },
    {image:"/AI_Coach.png"}
  ];
};
/*
<meta property="og:title" content="{{Your Website Title}}">
<meta property="og:description" content="{{Brief description of your website}}">
<meta property="og:image" content="{{URL to your logo image}}">
<meta property="og:url" content="{{URL of the webpage}}">
<meta property="og:type" content="website">

*/


export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindCSS }];

export async function loader({request}) {
  const user = await getUser(request);
  
  return {  user };
}

export default function Component() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" >
      
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" /> 
        <Meta />
        <Links />
      </head>
      <body className="bg-background dark:bg-darkBackground         text-lg text-text dark:text-darkText">
        <PageTransitionProgressBar />
        {children}
        <ToastContainer
position="bottom-center"
autoClose={1000}
limit={7}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Zoom}
className="text-sm font-thin text-blue-700"
/>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  //let errorMessage = error instanceof Error ? error.message : null;
  let heading = 'Unexpected Error';
  let message =
    'We are very sorry. An unexpected error occurred. Please try again or contact us if the problem persists.';
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
        heading = '401 Unauthorized';
        message = 'Oops! Looks like you tried to visit a page that you do not have access to.';
        break;
      case 404:
        heading = '404 Not Found';
        message = 'Oops! Looks like you tried to visit a page that does not exist.';
        break;
    }
  }
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <Document>
      <section className="m-5 lg:m-20 flex flex-col gap-5">
      <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1>{heading}</h1>
            <p>{message}</p>{' '}
            {errorMessage && (
                <div className="border-4 border-red-500 bg-red-300 p-10 rounded-lg">
                  {' '}
                  <p>Error message: {errorMessage}</p>{' '}
                </div>
              )}
      </div>
        
      </section>
    </Document>
  );
}



