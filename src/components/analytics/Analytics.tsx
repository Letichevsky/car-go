import Script from "next/script";
import { gtmId } from "@/lib/analytics";

/**
 * Google Tag Manager + Google Consent Mode v2.
 *
 * Порядок важен: сначала в head исполняется инлайн-скрипт с настройками согласия
 * (по умолчанию всё запрещено), и только потом грузится сам GTM. Иначе теги успеют
 * поставить рекламные куки до того, как человек что-то выбрал, — в ЕС так нельзя.
 *
 * Идентификатор контейнера пуст → не подключается ничего: ни скрипта, ни баннера.
 * Локальная разработка и превью остаются чистыми.
 */

/** Дефолты согласия. Идут в <head> до любых тегов. */
const consentScript = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{
 ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
 analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',
 wait_for_update:500});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
try{if(localStorage.getItem('cargo-consent')==='granted'){gtag('consent','update',{
 ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}}catch(e){}
`
  .replace(/\n/g, "")
  .trim();

/** Ставится в <head>, до всего остального. */
export function ConsentDefaults() {
  if (!gtmId) return null;
  return <script dangerouslySetInnerHTML={{ __html: consentScript }} />;
}

/**
 * Загрузчик контейнера. `afterInteractive` — рекомендация Next для тегов аналитики:
 * страница успевает отрисоваться и стать интерактивной, счётчик приезжает следом.
 */
export function GoogleTagManager() {
  if (!gtmId) return null;

  return (
    <>
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${gtmId}')`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
