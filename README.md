# EASTBOUND V11 — English / Français / 简体中文

A five-page, GitHub Pages-ready travel website for Eastern Canada, based on V10.3.

## Quick start
1. Upload the **contents** of this folder to the root of your GitHub repository (not the ZIP file itself).
2. Under **Settings → Pages**, select **Deploy from a branch → main → /(root)**.
3. Open your GitHub Pages address (`https://USERNAME.github.io/REPOSITORY/`).
4. First-time visitors see **English** by default. Use the language selector in the top navigation to switch to **Français** or **简体中文**. The selection is saved in browser localStorage and shared by all five pages.

## Files and routes
- `index.html` — destinations, attractions, restaurants, shopping, ferries, reviews.
- `planner.html` — independent itinerary planner, flight links, Mapbox route map.
- `stories.html` — curated day-by-day journeys with original source links.
- `vlogs.html` — travel videos linking to the creators on YouTube.
- `place.html?type=restaurant&city=toronto&item=0` — independent place details and Google Maps iframe; shopping uses `type=shopping`.
- `i18n_catalog.js` — user-facing translated phrases, English and French.
- `i18n.js` — language persistence and dynamic-card localization.
- `i18n.css` — responsive language picker styles.
- `locales.txt` — readable translation source (Chinese | English | French).

## Language behavior
- Default: English for new visitors. Browser preference does not override English.
- Three choices: English, Français, 简体中文.
- No registration, translation account or paid translation API is necessary.
- Selection persists across all pages in the same browser. Optional `?lang=en`, `?lang=fr`, `?lang=zh` initializes a language.
- Interface labels, main marketing copy, controls, major section introductions, itinerary cards, place guides, Vlog cards and curated route displays are localized. Many long Chinese editorial paragraphs have **concise, independently written localized summaries rather than literal translations**; original proper nouns and quotes may remain in their source language to protect accuracy and attribution.
- All route logic, external sources, booking links and map configuration remain from V10.3. The Google Maps iframe remains in restaurant/shopping details; Mapbox remains on the planner page.

## Map configuration
- Retain your existing `mapbox_config.js` when replacing an older deployment if you have entered a public Mapbox token.
- Retain `google_maps_config.js` if you use the official Google Maps Embed API with a public restricted key.
- Never commit a private `sk.` token or Google credentials.
- Mapbox and Google Maps may be restricted by provider policies and network conditions.

## Important
- Data is editorial and is not live hotel, restaurant or flight inventory.
- External image and video content needs an internet connection and is subject to creators’ usage rules.
- Static GitHub Pages hosting does not provide user accounts or a server-side translation service.

## 简体中文说明
将解压后的所有文件上传到 GitHub 仓库根目录，启用 Pages 的 `main / (root)`。新访客默认英文，可在顶部切换 Français / 简体中文。语言偏好保存在浏览器；保留既有 Mapbox 与 Google Maps 配置文件。部分长篇编辑内容显示经过整理的英文或法文摘要，而非逐句直译。

## Instructions en français
Téléversez tous les fichiers décompressés à la racine du dépôt GitHub, puis activez Pages sur `main / (root)`. L’anglais est la langue par défaut, avec un sélecteur Français / 简体中文 dans la navigation. Votre choix est enregistré dans ce navigateur. Conservez la configuration de Mapbox et Google Maps existante. Certains longs textes sont présentés sous forme de résumés localisés, plutôt que de traductions littérales.
