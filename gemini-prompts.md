# Промпты для генерации фото — с референсом (Gemini / MJ / Flux)

Главная проблема текстовых промптов «из головы» — модель додумывает позу, крой,
свет. Чтобы Gemini понял **точно**, что копировать, а что менять — **прикрепляй
референс-фото прямо в чат**, а не только пиши текст. Ниже — как это сделать и
готовые детальные промпты под каждое фото.

---

## Как это делать в Gemini (пошагово)

1. Открой **gemini.google.com** (или Google AI Studio → Imagen, если нужен
   пакетный режим) → выбери модель с картинками (Gemini 3 Pro Image / «Nano
   Banana» — так называют текущую image-модель Gemini в комьюнити).
2. **Прикрепи референс-фото** кнопкой скрепки — используй файл **image 1**
   (модель VETEMENTS×ALPHA, чёрный образ, лицо скрыто капюшоном, кляксы на
   фоне) — это твой якорь позы/света/композиции.
3. В сообщение вставь текстовый промпт из блока **A** ниже — целиком, включая
   секции TASK / KEEP / CHANGE. Не сокращай — конкретика важнее краткости.
4. Получишь чёрный вариант (OBSIDIAN). **Сохрани именно этот результат** —
   он станет новым референсом.
5. Для GLACIER и ASHFALL — открой **новый ход в том же чате**, прикрепи
   **свежесгенерированное чёрное фото** (не оригинальный референс!) и
   попроси только: *«Keep everything identical — pose, lighting, background,
   camera angle, model, all art direction — change ONLY the jacket and pants
   color to off-white / snow-white, keep all seams, pockets and quilting
   detail the same»*. Так поза и свет не «поплывут» между тремя карточками.
6. Если Gemini рисует лицо или логотипы — сразу пиши правку: *«remove any
   face, remove all text and logos, keep head fully covered by hood/goggles»*.

То же самое для фонов гор: прикрепи **image 4** (гора Stüssy, ч/б, плакатный
шрифт снизу) как референс тона и контраста, и **image 3** как референс
«снег + горы вдалеке» для композиции.

---

## A. Модель в куртке — детальный промпт (3 цвета)

Структура промпта осознанно разбита на блоки — **не удаляй заголовки блоков**,
это резко повышает точность у Gemini/Imagen (модель обрабатывает структуру
лучше сплошного текста).

### A1 — OBSIDIAN (чёрный) — генерируй первым, это опорный кадр

```
TASK: Using the attached reference photo as the exact template for pose,
camera angle, composition, lighting and background art style, generate a
new high-fashion streetwear editorial poster for a brand called KHRUSTIKS.

KEEP FROM REFERENCE:
- Exact body pose: standing centered, weight on one leg, arms relaxed,
  slight forward lean, shoulders squared to camera.
- Exact camera framing: full body, feet to top of hood, subject fills
  roughly 55% of frame height, shot straight-on at chest height.
- Exact lighting: single soft overhead key light, soft falloff to black
  at the edges, subtle rim light on the shoulders.
- Exact background style: torn black ink-brush / spray-paint splash shapes
  radiating outward behind the subject like broken wings, on a heavy-grain
  off-white to black vertical gradient background (white top-left corner
  fading to solid black by mid-frame).
- Exact photographic treatment: monochrome black and white, 35mm film
  grain, high contrast, slightly underexposed, newsprint texture.

CHANGE / SUBJECT:
- Face completely hidden: matte black balaclava + black ski goggles +
  oversized black hood pulled fully up, zero skin visible.
- Jacket: oversized MATTE BLACK down puffer bomber, ribbed collar and
  cuffs, asymmetric two-way front zipper (silver YKK pull), horizontal
  quilted baffles across chest and sleeves, one chest zip pocket, drawstring
  adjustable hem.
- Pants: matte black baggy cargo trousers, two large side cargo pockets
  with flap and snap closure, drawstring waist, tapered ankle cuffs with
  side zips, worn slightly oversized/slouchy like the reference.
- Footwear: black chunky combat boots.
- Gloves: black leather tactical gloves.
- No visible logos, no visible text anywhere on the garment or background.

CAMERA: shot as if on a Hasselblad medium-format camera, 80mm lens, f/5.6,
studio strobe lighting, vertical 4:5 aspect ratio, print-poster resolution.

Negative prompt: color, visible face or skin, cartoon, illustration, 3D
render look, low detail, text, logos, watermark, blurry, extra limbs,
warm tones, soft daylight.
```

### A2 — GLACIER (белый) — используй как референс уже сгенерированный OBSIDIAN

```
TASK: Attached is the finished KHRUSTIKS OBSIDIAN poster. Recreate it
EXACTLY — same model, same pose, same camera framing, same lighting, same
background splash art, same film grain and contrast — changing ONLY the
garment color.

CHANGE ONLY:
- Jacket: same cut and construction, recolor to OFF-WHITE / SNOW WHITE
  (warm-neutral off-white, not pure paper-white), keep all quilting seams,
  zipper (now a dark charcoal zipper for contrast), pocket and collar
  details identical in placement.
- Pants: same cut, recolor to a slightly darker light-grey to keep some
  contrast against the jacket.
- Balaclava, goggles, hood: recolor to off-white / light-grey to match.
- Boots and gloves: keep black, for contrast against the white fit.
- Background splash art: keep identical composition, but invert the tonal
  balance slightly — more white negative space, black splash shapes now
  read as sharper silhouettes against the lighter garment.

KEEP EXACTLY: pose, camera angle, framing, lighting direction, grain,
contrast, aspect ratio 4:5, no face, no logos, no text.

Negative prompt: color, visible face or skin, cartoon, text, logos,
watermark, blurry, warm tones, changed pose, changed camera angle.
```

### A3 — ASHFALL (серый) — используй как референс тот же OBSIDIAN

```
TASK: Attached is the finished KHRUSTIKS OBSIDIAN poster. Recreate it
EXACTLY — same model, same pose, same camera framing, same lighting, same
background splash art, same film grain and contrast — changing ONLY the
garment color.

CHANGE ONLY:
- Jacket: same cut and construction, recolor to ASH GREY / CHARCOAL GREY
  (mid-tone, between the black and white variants), quilting channels
  should read clearly through subtle tonal shading on the grey fabric.
- Pants: same cut, slightly darker grey than the jacket for tonal depth.
- Balaclava, goggles, hood: mid-grey to match.
- Boots and gloves: keep black.
- Background splash art: keep identical composition and tonal balance to
  the original OBSIDIAN version (mid-contrast, not inverted).

KEEP EXACTLY: pose, camera angle, framing, lighting direction, grain,
contrast, aspect ratio 4:5, no face, no logos, no text.

Negative prompt: color, visible face or skin, cartoon, text, logos,
watermark, blurry, warm tones, changed pose, changed camera angle.
```

**Формат вывода:** вертикальный постер 4:5, минимум 1600×2000 px, PNG.
Проси у Gemini «highest resolution / print quality» отдельной фразой в конце —
иначе может отдать превью-разрешение.

---

## B. Фон гор — 2 версии (разные секции сайта, разные пропорции)

Обе секции уже свёрстаны и ждут замены SVG-плейсхолдера на фото
(`.hero__mountains` и `.story__bg` в [styles.css](styles.css)). Прикрепи
**image 4** (Stüssy-референс) как референс тона для обеих генераций.

### B1 — HERO-фон (вертикальный, тесный, за спиной модели)

```
TASK: Using the attached reference photo's mood, contrast and color
treatment as a style guide, generate a vertical mountain landscape
background photo for a puffer-jacket brand poster.

SCENE: Extreme wide-angle vertical shot of jagged black arctic mountain
peaks, looking slightly upward from a low camera angle. Peaks are half
buried in fresh white snow on their upper third. A thick, glossy, black
ink-like liquid substance oozes down the rock faces in vertical streaks,
pooling into a dark reflective lake in the immediate foreground.

SKY: Heavy overcast graphite-grey sky, bleeding to near-solid black at
the very top of frame — needs to stay dark enough that a black garment
silhouette placed in front of it later will still read clearly.

NO PEOPLE, no text, no logos, no buildings, no roads.

TREATMENT: monochrome black and white, deep blacks, cold snow-white
highlights, no color casts, 35mm film grain, subtle vignette, brutal
minimalism, high-end editorial landscape photography.

CAMERA: as if shot on a Hasselblad, 24mm lens, f/8, vertical 3:4 aspect
ratio, minimum 2000×2600 px resolution.

Negative prompt: color, warm light/sunset, human figures, animals,
buildings, text, logos, watermark, low detail, blurry, cartoon.
```

### B2 — STORY-баннер (широкий, кинематографичный, для секции-манифеста)

```
TASK: Using the attached reference photo's mood, contrast, grain and
composition style as a guide, generate an ultra-wide cinematic mountain
landscape banner for a puffer-jacket brand's manifesto section.

SCENE: Ultra-wide (21:9) symmetrical composition, one dominant tallest
jagged black mountain peak centered in frame, flanked by smaller peaks on
both sides descending toward the edges. Upper two-thirds of the peaks are
covered in pristine white snow; lower third transitions to bare black
rock. Thick glossy black ink-like liquid substance pours down multiple
slopes in vertical rivers, pooling into dark mirror-like lakes across the
foreground.

SKY: Heavy overcast graphite sky, completely flat and moody, no sun, no
clouds detail — just a graduated dark grey.

NO PEOPLE, no text, no logos, no buildings — this is a pure landscape
plate, text will be added separately on top in post-production, so leave
generous empty negative space in the upper third and lower-left corner
for a headline and small caption to be overlaid later.

TREATMENT: monochrome black and white, deep blacks, cold snow-white
highlights, no color casts, 35mm film grain, subtle vignette, brutal,
apocalyptic, high-end editorial landscape photography.

CAMERA: as if shot on a Hasselblad, 35mm lens, f/8, horizontal 21:9
aspect ratio, minimum 3400×1460 px resolution.

Negative prompt: color, warm light/sunset, human figures, animals,
buildings, text, logos, watermark, low detail, blurry, cartoon, busy sky.
```

---

## C. (опционально) Packshot куртки без модели — для карточек/модалки

Если захочешь товарные фото без модели (чистая куртка на невидимом манекене) —
прикрепи получившийся A1/A2/A3 кадр как референс кроя и попроси:

```
TASK: Using the attached photo as the exact garment reference (same cut,
same color, same quilting/pocket/zipper details), generate a clean studio
product photograph of ONLY the jacket — no model, no head, no hands —
as if displayed on an invisible mannequin, front view, centered.

BACKGROUND: seamless charcoal (#0a0a0a) softly graduated to black at the
edges, soft rim light behind to define the silhouette, soft key light
front-left to show quilting texture.

Vertical 3:4, product-catalog quality, ultra-detailed fabric.

Negative prompt: visible model, mannequin form visible, text, logos,
watermark, color casts.
```

---

## D. Модель БЕЗ фона — вырезанная фигура для многократного использования (рекомендую)

**Зачем отдельно от A:** сайт кладёт модель на свой собственный горный фон
(hero, карточки, модалка). Если сгенерировать фигуру с готовым фоном-плакатом
(как в A), в каждой карточке будет свой случайный кусок фона — не соберётся
в целостную композицию. Вырезанная фигура на прозрачном PNG ложится на один
и тот же фон сайта (B1/B2) везде — hero, карточка, модалка — и масштабируется
под каждое место через CSS.

**Важно:** не проси у Gemini «прозрачный фон» напрямую — растровые модели не
умеют в альфа-канал и часто просто рисуют шахматку или белый фон вместо неё.
Правильный путь — попросить **ровный однотонный фон без градиента и текстуры**,
а затем вырезать его отдельным шагом (remove.bg, «Выбрать объект» в
Photoshop, или пришли готовое фото мне — прогоню через фоновырезающий
инструмент за один шаг).

Промпты идентичны A1/A2/A3, меняется только блок `BACKGROUND`:

### D1 — OBSIDIAN, cutout-версия

```
TASK: Using the attached reference photo as the exact template for pose,
camera angle, framing and lighting on the SUBJECT ONLY, generate a new
high-fashion streetwear product photo for a brand called KHRUSTIKS.

KEEP FROM REFERENCE:
- Exact body pose: standing centered, weight on one leg, arms relaxed,
  slight forward lean, shoulders squared to camera.
- Exact camera framing: full body, feet to top of hood, subject fills
  roughly 70% of frame height, shot straight-on at chest height.
- Exact lighting on the subject: single soft overhead key light, soft
  falloff, subtle rim light on the shoulders.

BACKGROUND: seamless flat mid-grey studio backdrop (#808080), perfectly
even lighting with no gradient, no shadow falloff, no texture, no props —
optimized for clean background removal afterward.

SUBJECT:
- Face completely hidden: matte black balaclava + black ski goggles +
  oversized black hood pulled fully up, zero skin visible.
- Jacket: oversized MATTE BLACK down puffer bomber, ribbed collar and
  cuffs, asymmetric two-way front zipper (silver YKK pull), horizontal
  quilted baffles across chest and sleeves, one chest zip pocket,
  drawstring adjustable hem.
- Pants: matte black baggy cargo trousers, two large side cargo pockets
  with flap and snap closure, drawstring waist, tapered ankle cuffs with
  side zips, worn slightly oversized/slouchy.
- Footwear: black chunky combat boots. Gloves: black leather tactical.
- No visible logos, no visible text anywhere on the garment.

CAMERA: Hasselblad medium-format look, 80mm lens, f/5.6, studio strobe,
vertical 3:4 aspect ratio, print-poster resolution, highest resolution.

Negative prompt: color, visible face or skin, cartoon, illustration, text,
logos, watermark, blurry, extra limbs, warm tones, shadows on backdrop,
gradient backdrop, props, floor line visible.
```

### D2 — GLACIER, cutout-версия (используй D1-результат как референс)

```
TASK: Attached is the finished KHRUSTIKS OBSIDIAN cutout photo. Recreate
it EXACTLY — same model, same pose, same camera framing, same lighting,
same flat grey studio backdrop — changing ONLY the garment color.

CHANGE ONLY:
- Jacket: same cut/construction, recolor to OFF-WHITE / SNOW WHITE, dark
  charcoal zipper for contrast, all seams/pockets/collar unchanged.
- Pants: same cut, recolor to light-grey.
- Balaclava, goggles, hood: recolor to off-white / light-grey.
- Boots and gloves: keep black.

KEEP EXACTLY: pose, camera angle, framing, lighting, flat grey backdrop,
aspect ratio 3:4, no face, no logos, no text.

Negative prompt: color, visible face or skin, text, logos, watermark,
blurry, changed pose, changed camera angle, gradient backdrop.
```

### D3 — ASHFALL, cutout-версия (используй D1-результат как референс)

```
TASK: Attached is the finished KHRUSTIKS OBSIDIAN cutout photo. Recreate
it EXACTLY — same model, same pose, same camera framing, same lighting,
same flat grey studio backdrop — changing ONLY the garment color.

CHANGE ONLY:
- Jacket: same cut/construction, recolor to ASH GREY / CHARCOAL GREY,
  quilting channels readable through tonal shading.
- Pants: same cut, slightly darker grey than jacket.
- Balaclava, goggles, hood: mid-grey.
- Boots and gloves: keep black.

KEEP EXACTLY: pose, camera angle, framing, lighting, flat grey backdrop,
aspect ratio 3:4, no face, no logos, no text.

Negative prompt: color, visible face or skin, text, logos, watermark,
blurry, changed pose, changed camera angle, gradient backdrop.
```

**После генерации:** вырежи фон (remove.bg за 10 секунд, или пришли мне PNG —
сделаю сама) → получишь `model-obsidian-cutout.png` и т.д. с прозрачным
альфа-каналом. Это то, что реально ляжет в `.hero__figure`, `.card__media`
и `.modal__media` вместо текущих SVG-силуэтов.

---

## Куда класть готовые файлы

```
assets/
  model-obsidian-cutout.png   ← D1 (без фона, прозрачный PNG) — основной, для сайта
  model-glacier-cutout.png    ← D2 (без фона, прозрачный PNG) — основной, для сайта
  model-ashfall-cutout.png    ← D3 (без фона, прозрачный PNG) — основной, для сайта
  hero-mountains.jpg          ← B1 (вертикальный, за моделью в hero)
  story-mountains.jpg         ← B2 (широкий, секция-манифест)
  model-obsidian-poster.jpg   ← A1, опционально — для соцсетей/маркетинга
  model-glacier-poster.jpg    ← A2, опционально
  model-ashfall-poster.jpg    ← A3, опционально
  pack-obsidian.jpg           ← C, опционально
  pack-glacier.jpg            ← C, опционально
  pack-ashfall.jpg            ← C, опционально
```

**Минимальный набор для сайта:** только D1–D3 (cutout) + B1 + B2 — этого
хватит, чтобы полностью убрать SVG-плейсхолдеры. A и C — по желанию, для
маркетинга и отдельных товарных карточек.

Скажи «фото готовы» — подменю SVG-плейсхолдеры на реальные `<img>` в
[index.html](index.html), [script.js](script.js) и фоны в [styles.css](styles.css).

## Быстрые советы

- **Всегда генерируй пачкой 3–4** на каждый промпт и выбирай лучший — даже с
  референсом модель немного «плавает» между сидами.
- **Если Gemini рисует лицо/логотип** — не переписывай весь промпт, просто
  ответом в том же чате: *«redo this, remove face and any text/logo, keep
  everything else identical»*. Итеративная правка работает лучше, чем новый
  промпт с нуля.
- **Апскейл**: если разрешение вышло маленьким — прогони результат через
  `upscale_image` (Gemini/встроенный апскейлер) до 2× перед тем, как класть
  в `assets/`.
- **MJ v6.1 / Flux 1.1 Pro**: те же промпты работают, добавь `--ar 4:5
  --style raw --stylize 200` (MJ) или усиливай `black and white photography,
  no color` в начале (Flux, он тяготеет к цвету).
