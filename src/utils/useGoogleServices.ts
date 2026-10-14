import { useEffect } from 'react';
import { PortalSettings } from '../types/news';

/**
 * useGoogleServices: Production-grade client-side injector for Google Services
 * - Google Analytics 4 (GA4): Injects gtag.js with Measurement ID (G-XXXXXXXX)
 * - Google Tag Manager (GTM): Injects gtm.js with Container ID (GTM-XXXXXXX)
 * - Google Search Console (GSC): Injects meta[name="google-site-verification"]
 * - Google AdSense: Injects adsbygoogle.js with Client ID (ca-pub-XXXXXXXX)
 *
 * Ensures zero duplicate tags, SPA route pageview tracking, and clean unmounting.
 */
export function useGoogleServices(
  portalSettings: PortalSettings,
  currentRouteInfo?: { path: string; title: string }
) {
  const googleConfig = portalSettings.googleServices;
  const gaId = googleConfig?.googleAnalyticsId?.trim() || '';
  const gtmId = googleConfig?.googleTagManagerId?.trim() || '';
  const gscVerification = googleConfig?.searchConsoleVerification?.trim() || '';
  const adsenseId =
    googleConfig?.adsenseClientId?.trim() ||
    portalSettings.adSettings?.adsenseClientId?.trim() ||
    '';
  const adsenseEnabled = googleConfig?.adsenseAutoAds !== false;

  // 1. Google Analytics 4 (GA4) Injection
  useEffect(() => {
    const scriptId = 'kd-ga4-script';
    const inlineId = 'kd-ga4-init';

    // Validate GA4 format (G-XXXXXXXXXX)
    const isValidGaId = /^G-[A-Z0-9]+$/i.test(gaId);

    if (isValidGaId) {
      // Inject external gtag.js if not already present
      let gaScript = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!gaScript) {
        gaScript = document.createElement('script');
        gaScript.id = scriptId;
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(gaScript);
      } else if (!gaScript.src.includes(gaId)) {
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      }

      // Inject inline initialization if not already present
      let initScript = document.getElementById(inlineId) as HTMLScriptElement | null;
      if (!initScript) {
        initScript = document.createElement('script');
        initScript.id = inlineId;
        initScript.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `;
        document.head.appendChild(initScript);
      }
    } else {
      // Remove scripts if ID was removed or is invalid
      const existingGa = document.getElementById(scriptId);
      if (existingGa) existingGa.remove();
      const existingInit = document.getElementById(inlineId);
      if (existingInit) existingInit.remove();
    }
  }, [gaId]);

  // 1b. Track SPA Route Changes in GA4
  useEffect(() => {
    if (!currentRouteInfo || !/^G-[A-Z0-9]+$/i.test(gaId)) return;

    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'page_view', {
        page_path: currentRouteInfo.path,
        page_title: currentRouteInfo.title || document.title,
      });
    }
  }, [currentRouteInfo?.path, currentRouteInfo?.title, gaId]);

  // 2. Google Tag Manager (GTM) Injection
  useEffect(() => {
    const gtmScriptId = 'kd-gtm-script';
    const isValidGtmId = /^GTM-[A-Z0-9]+$/i.test(gtmId);

    if (isValidGtmId) {
      let gtmScript = document.getElementById(gtmScriptId) as HTMLScriptElement | null;
      if (!gtmScript) {
        gtmScript = document.createElement('script');
        gtmScript.id = gtmScriptId;
        gtmScript.textContent = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(gtmScript);
      }
    } else {
      const existingGtm = document.getElementById(gtmScriptId);
      if (existingGtm) existingGtm.remove();
    }
  }, [gtmId]);

  // 3. Google Search Console Verification Meta Tag
  useEffect(() => {
    const metaId = 'kd-gsc-verification-meta';
    if (gscVerification) {
      // Clean up token if user pasted full <meta ...> tag
      let token = gscVerification;
      const contentMatch = gscVerification.match(/content=["']([^"']+)["']/i);
      if (contentMatch) {
        token = contentMatch[1];
      }

      let meta = document.querySelector(`meta[name="google-site-verification"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.id = metaId;
        document.head.appendChild(meta);
      }
      meta.content = token;
    } else {
      const existingMeta = document.getElementById(metaId);
      if (existingMeta) existingMeta.remove();
    }
  }, [gscVerification]);

  // 4. Google AdSense Script Injection
  useEffect(() => {
    const adsScriptId = 'kd-adsense-script';
    const isValidAdsense = /^ca-pub-[0-9]+$/i.test(adsenseId);

    if (isValidAdsense && adsenseEnabled) {
      let adsScript = document.getElementById(adsScriptId) as HTMLScriptElement | null;
      if (!adsScript) {
        adsScript = document.createElement('script');
        adsScript.id = adsScriptId;
        adsScript.async = true;
        adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
          adsenseId
        )}`;
        adsScript.crossOrigin = 'anonymous';
        document.head.appendChild(adsScript);
      }
    } else {
      const existingAds = document.getElementById(adsScriptId);
      if (existingAds) existingAds.remove();
    }
  }, [adsenseId, adsenseEnabled]);
}
