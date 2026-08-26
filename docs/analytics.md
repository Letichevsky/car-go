# Аналитика: GTM + GA4 + Google Ads

Что уже стоит на сайте, что должен сделать маркетолог в интерфейсе Google и как это проверить.

---

## 1. Что сделано в коде

| Что                                          | Где                                            |
| -------------------------------------------- | ---------------------------------------------- |
| Загрузка контейнера GTM                      | `src/components/analytics/Analytics.tsx`       |
| Consent Mode v2 (по умолчанию всё запрещено) | тот же файл + `src/lib/consent.ts`             |
| Баннер согласия                              | `src/components/analytics/ConsentBanner.tsx`   |
| События в `dataLayer`                        | `src/lib/analytics.ts`                         |
| Просмотры страниц и клики по контактам       | `src/components/analytics/AnalyticsClient.tsx` |
| Отправка формы                               | `src/components/site/LeadForm.tsx`             |

**Принцип:** сайт не знает ни про GA4, ни про Google Ads. Он только кладёт в `dataLayer`
осмысленные события. Какие теги на них навесить — решается в GTM, без релиза сайта.

---

## 2. Включение

Одна переменная окружения:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Локально — в `.env.local`, на хостинге — в настройках проекта.
**Пусто → не грузится ничего:** ни GTM, ни баннер согласия. Локальная разработка чистая.

---

## 3. События в dataLayer

| `event`                 | Когда                                          | Параметры                                             |
| ----------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| `page_view`             | Загрузка и каждый клиентский переход           | `page_path`, `page_title`, `page_locale`, `page_type` |
| `lead_form_submit`      | Отправлена форма заявки (открывается WhatsApp) | `lead_location`, `lead_method: "whatsapp"`            |
| `whatsapp_click`        | Клик по любой ссылке WhatsApp                  | `lead_location`                                       |
| `phone_click`           | Клик по номеру телефона (`tel:`)               | `lead_location`                                       |
| `telegram_click`        | Клик по Telegram                               | `lead_location`                                       |
| `cookie_consent_update` | Ответ на баннер согласия                       | `consent_state: "granted" \| "denied"`                |

**`lead_location`** — где на странице нажали: `hero`, `cta`, `header`, `footer`, `mobile-bar`,
`services`, `service-page`, `contacts-page`, `areas`, `faq`. Значение берётся из атрибута
`data-analytics-zone` ближайшей секции, так что новые блоки размечаются одной строкой.

**`page_type`** — `home`, `service`, `contacts`, `works`, `other`.

Клики отслеживаются делегированием: один слушатель на весь документ. Это значит, что
любая ссылка на телефон или WhatsApp — включая те, что заказчик когда-нибудь вставит
через админку, — попадёт в отчёты сама, без правок кода.

---

## 4. Что настроить в GTM

### 4.1 Переменные

Создать **Data Layer Variable** для каждого параметра: `lead_location`, `lead_method`,
`page_path`, `page_title`, `page_locale`, `page_type`, `consent_state`.

### 4.2 GA4

1. Тег **Google Tag** (GA4, `G-XXXXXXX`), триггер _Initialization – All Pages_.
2. В его настройках **снять галочку** «Send a page view event when this configuration loads».
   Переходы между страницами на сайте клиентские, автоматический просмотр посчитал бы
   только первую страницу.
3. Тег **GA4 Event** с именем `page_view`, параметры `page_path`, `page_title`, `page_locale`,
   `page_type`; триггер — Custom Event `page_view`.
4. По тегу **GA4 Event** на каждое действие: `lead_form_submit`, `whatsapp_click`,
   `phone_click`, `telegram_click`. В параметры добавить `lead_location`.
5. В GA4 зарегистрировать `lead_location`, `lead_method`, `page_type`, `page_locale`
   как **custom dimensions** (Admin → Custom definitions), иначе их не будет в отчётах.
6. Отметить `lead_form_submit`, `whatsapp_click`, `phone_click` как **key events**
   (бывшие «конверсии»).

### 4.3 Google Ads

1. Тег **Google Ads Conversion Linker**, триггер _All Pages_.
2. На каждое целевое действие — свой **Google Ads Conversion Tracking** с отдельным
   `Conversion ID / Label`. Минимум три конверсии: заявка через форму, клик в WhatsApp,
   звонок.
3. Ценность конверсии заранее не проставлена: цены индивидуальные. Когда у заказчика
   появится средний чек, можно передавать `value` и `currency: EUR` — в коде для этого
   достаточно расширить событие в `src/lib/analytics.ts`.
4. `gclid` доезжает: при запрещённых куках включён `url_passthrough`, идентификатор
   клика передаётся через адрес страницы.

### 4.4 Согласие (важно для ЕС)

В контейнере включить **Consent Overview** и каждому тегу проставить требуемые типы
согласия: GA4 — `analytics_storage`, Ads — `ad_storage` + `ad_user_data` +
`ad_personalization`.

Сайт уже выставляет **Consent Mode v2** с дефолтом «запрещено» до ответа человека:

- запрещены `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`;
- включены `ads_data_redaction` и `url_passthrough`;
- `wait_for_update: 500` — теги ждут полсекунды, вдруг выбор уже сохранён;
- выбор хранится в `localStorage` (`cargo-consent`) и применяется до загрузки GTM.

Тегам **не нужно** отдельно слушать `cookie_consent_update` — Consent Mode перезапустит
их сам. Событие есть на случай, если понадобится своя логика.

---

## 5. Как проверить

1. `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX npm run dev`.
2. **GTM Preview** (Tag Assistant) → адрес сайта. Слева видно каждое событие и его данные.
3. **GA4 DebugView** — Admin → DebugView, события приезжают в реальном времени.
4. Без GTM: открыть консоль браузера и набрать `dataLayer` — все события видны и локально,
   даже когда контейнер не подключён.

Проверить нужно всё: заявку из первого экрана, из нижней плашки, со страницы услуги;
клик по телефону в шапке; WhatsApp в шапке, на мобильной панели и в подвале.

---

## 6. Чего ещё нет

- **Страницы политики конфиденциальности и cookie.** Баннер согласия без неё юридически
  неполон. Нужен текст от заказчика (или пишем сами и он утверждает).
- **Отслеживание собственно разговора.** Мы считаем клик по номеру, а не состоявшийся
  звонок. Настоящий call tracking — это подменные номера, отдельный платный сервис.
- **Server-side GTM.** Дороже и сложнее; имеет смысл, когда пойдёт заметный трафик.
- **Отправка заявок в CRM/Telegram.** Сейчас заявка уходит в WhatsApp, событие в аналитику
  отправляется в момент нажатия кнопки — а не в момент, когда человек реально написал.
  Расхождение неизбежно, пока нет своего бэкенда.
