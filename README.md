# Mecenate — Test Assignment (Part 1 + Part 2)

Мобильное приложение на `React Native + Expo` (iOS/Android) для платформы Mecenate.

Реализованы экран ленты и экран детальной публикации с real-time обновлениями,
лайками, комментариями и обработкой состояний загрузки.

## Что реализовано

### Feed

- Список постов: аватар автора, имя автора, обложка, заголовок, превью, счетчики.
- Таб-фильтр: `Все / Бесплатные / Платные`.
- Cursor pagination (infinite scroll) + `pull-to-refresh`.
- Состояния `loading / empty / error` + skeleton.
- Переход в detail по тапу на **бесплатный** пост.
- Для `paid` постов отображается заблокированный контент + CTA.

### Post Detail

- Полный контент публикации: автор, обложка, текст, счетчики.
- Лайк с анимацией (Reanimated) и haptic feedback (`expo-haptics`).
- Список комментариев с lazy load (`useInfiniteQuery`).
- Поле ввода комментария + отправка нового комментария.
- Skeleton при загрузке экрана.
- Real-time через WebSocket:
  - `like_updated`
  - `comment_added`
  - автоматический reconnect после обрыва.

### State management / data flow

- `React Query` для API и кеша server-state.
- `MobX` для локального UI-state (например, раскрытие превью в карточках).
- Оптимистичные обновления и синхронизация счетчиков между feed/detail кешами.

## Дизайн и API

- Figma: [Test Assignment](https://www.figma.com/design/bAxXrk7TaPN13TZ60yf7uD/Test-Assignment?node-id=1-3265&p=f&t=h5UfroFjDUhl9Qnp-0)
- OpenAPI: [openapi.json](https://k8s.mectest.ru/test-app/openapi.json)
- WS docs: [WebSocket docs](https://k8s.mectest.ru/test-app/docs)

## Стек

- TypeScript
- React Native + Expo + expo-router
- React Query (`@tanstack/react-query`)
- MobX (`mobx`, `mobx-react-lite`)
- Reanimated
- Дизайн-токены (`src/shared/theme/tokens.ts`)

## Требования

- Node.js 20+
- npm 10+

## Переменные окружения

Создай `.env` из шаблона:

```bash
cp .env.example .env
```

Переменные:

- `EXPO_PUBLIC_API_BASE_URL` — базовый URL API
- `EXPO_PUBLIC_API_TOKEN` — Bearer token (UUID)

## Локальный запуск

1. Установить зависимости:

```bash
npm install
```

2. Подготовить `.env`:

```bash
cp .env.example .env
```

3. Запустить dev server:

```bash
npm run start
```

4. Открыть проект:

- Expo Go (скан QR из терминала / DevTools)
- iOS Simulator
- Android Emulator

## Запуск в Expo Go

1. Установить Expo Go:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Выполнить:

```bash
npm run start
```

3. Отсканировать QR-код из терминала.

## Скрипты

```bash
npm run start
npm run ios
npm run android
npm run web
npm run lint
npm run typecheck
npm run test
npm run format
npm run format:check
```

## Структура проекта

- `src/app` — роутинг (expo-router)
- `src/entities/post` — доменные сущности поста (types/ui/lib)
- `src/features/feed` — фича ленты
- `src/features/post-detail` — фича detail экрана
- `src/shared/api` — HTTP клиент и базовые API утилиты
- `src/shared/providers` — app providers
- `src/shared/theme` — дизайн-токены
- `src/shared/ui/kit` — переиспользуемый UI-kit

## Формат сдачи

- Публичный GitHub репозиторий
- README с инструкцией по запуску и `.env`
- Проверка через Expo Go
