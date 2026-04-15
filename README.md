# Mecenate Feed (Test Assignment 1)

Мобильное приложение на `React Native + Expo` (iOS/Android) с экраном ленты публикаций для платформы Mecenate.

## Реализовано

- Экран `Feed` со списком постов
  - аватар автора
  - имя автора
  - обложка поста
  - title и превью текста
  - счетчики лайков и комментариев
- Курсорная пагинация при скролле вниз
- Pull-to-refresh
- Заглушка для закрытого поста (`tier: "paid"`)
- Error state при недоступном API:
  - текст: `Не удалось загрузить публикации`
  - кнопка: `Повторить`

## Стек

- TypeScript
- Expo + expo-router
- React Query (`@tanstack/react-query`) для server-state
- MobX (`mobx`, `mobx-react-lite`) для локального UI-state (раскрытие текста в карточках)
- Стили через дизайн-токены (`src/shared/theme/tokens.ts`)

## Требования

- Node.js 20+ (рекомендуется LTS)
- npm 10+

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать локальный `.env`:

```bash
cp .env.example .env
```

3. Запустить приложение:

```bash
npm run start
```

4. Открыть проект:
- в **Expo Go** на телефоне (сканировать QR из терминала/DevTools)
- или в iOS Simulator / Android Emulator.

## Проверка в Expo Go (формат сдачи)

Тестовое можно проверить напрямую через приложение Expo Go:

1. Установить Expo Go:
- iOS: https://apps.apple.com/app/expo-go/id982107779
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. В корне проекта запустить:

```bash
npm run start
```

3. Открыть Expo Go на телефоне и отсканировать QR-код.

4. Убедиться, что экран ленты загружается и работает:
- скролл + подгрузка
- pull-to-refresh
- error/empty состояния.

## Переменные окружения

- `EXPO_PUBLIC_API_BASE_URL` — базовый URL API
- `EXPO_PUBLIC_API_TOKEN` — Bearer token (валидный UUID)

Пример находится в `.env.example`.

## Полезные команды

```bash
npm run start
npm run ios
npm run android
npm run lint
npm run test
```

## Структура

- `src/app/` — роуты expo-router (`app.json` -> `expo-router.root = src/app`)
- `src/features/feed` — фича ленты
- `src/entities/post` — типы и UI части поста
- `src/shared/api` — HTTP-клиент
- `src/shared/providers` — `QueryClientProvider`
- `src/shared/theme` — дизайн-токены
