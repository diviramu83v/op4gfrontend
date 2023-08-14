import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';

import Header from '../components/nav/Nav';
import Sidebar from '../components/sidebar';
import '../styles/global.scss';
import QueryClientReducer from '../hooks/reducers/QueryClientReducer';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TargetingCriteriaProvider } from '../hooks/provider/TargetingCriteriaProvider';
import { RouteGuard } from '@/components/RouteGuard';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { state } = QueryClientReducer();

  if (router.pathname === '/login') {
    return (
      <QueryClientProvider client={state.queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    );
  }

  return (
    <>
      <Head>
        <title>RFP</title>
        <meta
          name='description'
          content='Generated by create next app'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <link
          rel='icon'
          href='/op4g-logo-white.svg'
        />
      </Head>
      <Header />
      <main>
        {/* {router.pathname !== "/404" && <Sidebar />} */}
        <div id="main-content">
          <SnackbarProvider maxSnack={3}>
            <TargetingCriteriaProvider>
              <QueryClientProvider client={state.queryClient}>
                <RouteGuard>
                  <Component {...pageProps} />
                </RouteGuard>
                <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
              </QueryClientProvider>
            </TargetingCriteriaProvider>
          </SnackbarProvider>
        </div>
      </main>
    </>
  );
}