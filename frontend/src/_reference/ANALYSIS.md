# Анализ data-table-filters

## Структура проекта

### Основные компоненты:

1. **DataTableProvider** - контекст для управления состоянием таблицы
2. **DataTableToolbar** - панель инструментов (фильтры, поиск, действия)
3. **DataTableFilterControls** - боковая панель с фильтрами
4. **DataTableFilterCommand** - глобальный поиск через Command (cmdk)
5. **DataTableSheet** - сайдбар с деталями строки (при клике на строку)
6. **DataTablePagination** - пагинация
7. **DataTableViewOptions** - управление видимостью колонок

### Live режим:

- Использует `useInfiniteQuery` из TanStack Query
- Периодически вызывает `fetchPreviousPage()` каждые 4 секунды
- Управляется через URL search params (nuqs)
- Можно легко адаптировать под WebSockets

### Используемые библиотеки:

- **@tanstack/react-table** - таблица (у нас есть)
- **@tanstack/react-query** - запросы (у нас есть)
- **nuqs** - управление URL search params (нужно добавить)
- **cmdk** - Command компонент для поиска (нужно проверить)
- **@radix-ui/react-sheet** - сайдбар (нужно проверить)
- **@radix-ui/react-accordion** - аккордеон для фильтров (нужно проверить)
- **@radix-ui/react-slider** - слайдер для фильтров (нужно проверить)

### Компоненты shadcn/ui:

Проверяем наличие в нашем проекте:
- ✅ button, input, select, label, separator, skeleton, tooltip, tabs
- ❓ sheet, accordion, slider, command, drawer, popover, hover-card, calendar

## План интеграции

### Вариант 1: Интеграция в проект (рекомендую)

**Преимущества:**
- Полный контроль над кодом
- Легкая кастомизация под наши нужды
- Нет зависимости от внешнего пакета
- Можно адаптировать под FSD архитектуру

**Недостатки:**
- Нужно поддерживать код самостоятельно
- Больше кода в проекте

### Вариант 2: Отдельный пакет

**Преимущества:**
- Переиспользование в других проектах
- Изоляция логики

**Недостатки:**
- Сложнее кастомизация
- Нужно настраивать монорепозиторий/пакеты
- Может быть избыточно для одного проекта

## Рекомендация

**Интегрировать прямо в проект**, потому что:
1. У нас уже есть похожая структура (widgets/table)
2. Нужна кастомизация под наши нужды (редактирование ячеек, права доступа)
3. Проще поддерживать и развивать
4. Можно адаптировать под FSD архитектуру

## Что нужно добавить:

1. **Компоненты shadcn/ui:**
   - Sheet (сайдбар)
   - Accordion (для фильтров)
   - Slider (для фильтров)
   - Command (для глобального поиска)
   - Drawer (для мобильных фильтров)
   - Calendar (для date picker)

2. **Библиотеки:**
   - nuqs (управление URL search params)
   - date-fns (для работы с датами)

3. **Хуки:**
   - use-debounce
   - use-hot-key
   - use-local-storage
   - use-media-query

4. **Компоненты таблицы:**
   - DataTableProvider
   - DataTableToolbar
   - DataTableFilterControls
   - DataTableFilterCommand
   - DataTableSheet
   - DataTablePagination
   - DataTableViewOptions

