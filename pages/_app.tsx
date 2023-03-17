import 'styles/main.css';
import 'styles/chrome-bug.css';
import 'styles/nprogress.css';
import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const LazyPrivateUserView = dynamic(
  () => import('@/components/GetPrivateUser'),
  {
    ssr: false
  }
);

const LazyLoadingProgressIndicatorView = dynamic(
  () => import('@/components/LoadingProgressIndicatorView'),
  {
    ssr: false
  }
);

const LazyProviders = dynamic(() => import('@/utils/providers'), {
  ssr: false
});

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WJX2GD2');
      `}
      </Script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBg9-ZM7XtlMUXiVRWKHBrkIs591IuH6g8&libraries=places"></script>
      {/* <Script
        type="text/javascript"
        src="https://app.termly.io/embed.min.js"
        data-auto-block="on"
        data-website-uuid="ebbae036-f375-4d17-b7b2-1f3af5f711a6"
      ></Script> */}
      <LazyProviders>
        <LazyLoadingProgressIndicatorView />
        <LazyPrivateUserView />
        <Component {...pageProps} />
      </LazyProviders>
    </>
  );
}
