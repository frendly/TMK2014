# CSSSR Project Template
**Шаблон проекта для быстрого старта.**

## Старт проекта

* Установите `gulp` и `bower` глобально:

```bash
npm i -g gulp bower
```

* Склонируйте себе репозиторий и перейдите в папку проекта:

```
git clone git@github.com:CSSSR/csssr-project-template.git new-project && cd new-project
```

* Установите зависимости, запустив `hook.sh` (находится в папке проекта) или вручную:

```
npm i && bower i
```

* Запустите Gulp.js:

```
gulp
```

* Откройте в браузере [`http://localhost:3001/`](http://localhost:3001/).

## Команды для запуска с Gulp.js

* Запуск Gulp с отслеживанием изменений:

```
gulp

// Или
gulp default
```

* Сборка в папку `dist`:

```
gulp build
```

* Сборка в папку `dist` с добавлением файла `robots.txt` для запрета индексации:

```
gulp build --robots
```

* Локальный сервер на другом порте:

```
gulp --port=9000
```

* Собирать скрипты и стили без минификации:

```
gulp --debug
```

* Воспроизводить звук при ошибках:

```
gulp --beep
```

* Расшарить локальный сервер через `ngrok`:

```
gulp --ngrok
```

* Открыть ссылку в браузере по умолчанию:

```
gulp --open
```

* Собрать архив из папки `dist`:

```
gulp zip
```

* Сжать изображения:

```
gulp imagemin
```

## Структура папок и файлов

```
├── app/                               # Исходники
│   ├── images/                        # Папка изображений
│   │   ├── sprite/                    # PNG изображения для генерации спрайта
│   │   └── sprite.png                 # Генерируемый спрайт, по умолчанию спрайта нет
│   ├── resources/                     # Статические файлы для копирования в dist/
│   ├── scripts/                       # Папка со скриптами
│   │   |── debug.js                   # Идентификация отладки на локальном сервере
│   │   └── common.js                  # Главный скрипт
│   ├── styles/                        # Папка со стилями Stylus
│   │   ├── base/                      # Базовые стили
│   │   │   ├── base.styl              # Базовый стилевой файл
│   │   │   ├── fonts.styl             # Подключение шрифтов
│   │   │   └── normalize.styl         # Сброс стилей
│   │   ├── blocks/                    # Стили блоков
│   │   |   └── main.styl              # Стили блока главной страницы
│   │   ├── helpers/                   # Помощники
│   │   │   ├── mixins.styl            # Примеси
│   │   │   ├── sprite.styl            # Переменные с данными спрайта, по умолчанию файла нет
│   │   │   └── variables.styl         # Переменные
│   │   └── common.styl                # Главный стилевой файл
│   └── templates/                     # Папка с шаблонами Jade
│       ├── blocks/                    # Папка с подключаемыми блоками
│       ├── helpers/                   # Папка с помощниками
│       │   ├── mixins/                # Папка с примесями
│       │   │   └── scripts.jade       # Примеси для скриптов
│       │   ├── mixins.jade            # Подключенные примеси
│       │   └── variables.jade         # Переменные
│       ├── layouts/                   # Папка с шаблонами раскладки
│       │   └── default.jade           # Шаблон раскладки по умолчанию
│       └── pages/                     # Папка с генерируемыми страницами
│           └── index.jade             # Шаблон одной из страниц
├── components/                        # Bower зависимости
├── dist/                              # Сборка
│   ├── assets/                        # Подключаемые ресурсы
│   │   ├── images/                    # Папка изображений
│   │   ├── scripts/                   # Папка скриптов
│   │   └── styles/                    # Папка стилей
│   └── index.html                     # Индексная страница
├── gulp/                              # Подключаемые скрипты для gulpfile.js
|   ├── tasks/                         # Скрипты с задачами для Gulp.js
|   ├── utils/                         # Утилиты в помощь к задачам
│   └── paths.coffee                   # Список путей для генерации файлов
├── .bowerrc                           # Конфигурация Bower с установкой папки для скриптов
├── .csscomb.json                      # Конфигурация форматирования CSS
├── .jscsrc                            # Конфигурация проверки JavaScript в JSCS
├── .jshintrc                          # Конфигурация проверки JavaScript в JSHint
├── .editorconfig                      # Конфигурация настроек редактора кода
├── .gitignore                         # Список исключённых файлов из Git
├── bower.json                         # Список библиотек для установки с помощью Bower
├── gulpfile.js                        # Файл для запуска Gulp.js
├── hook.sh                            # Набор команд для установки зависимостей NPM и Bower
├── package.json                       # Список пакетов и прочей информации
└── readme.md                          # Документация шаблона
```

Описание для некоторых папок:
* `app/` - папка с иходниками, из которой генерируюется `dist/`.
* `app/images/` - папка с фонами, паттернами и прочими стилевыми изображениями.
* `app/images/blocks/` - папка для картинок, относящихся к определённм блокам, по умолчанию папки нет.
* `app/images/sprite/` - папка с PNG-изображениями для генерации спрайта в `app/images/sprite.png` и файла стилей с CSS-переменными в `app/styles/sprite.styl`.
* `app/images/content/` - папка для временного контента, например, для товаров, аватарок, обложек и т.п., *по умолчанию папки нет*.
* `app/resources/assets/data/` - папка для данных в формате `json`, *по умолчанию папки нет*.
* `app/resources/assets/fonts/` - папка для шрифтов, *по умолчанию папки нет*.
* `app/resources/assets/images/svg/` - папка для векторных изображений SVG, *по умолчанию папки нет*.
* `dist/` - сборка сайта, по умолчанию её может не быть и можно без страха и риска её удалить, т.к. она генерируется каждый раз заново, при сборке всё её содержимое удаляется, поэтому руками в неё класть ничего не нужно.

## Компоненты
* [`animate.css`](https://github.com/daneden/animate.css)
* [`cookies-js`](https://github.com/ScottHamper/Cookies)
* [`fotorama`](http://fotorama.io/)
* [`fancybox`](http://fancyapps.com/fancybox/)
* [`jquery`](https://github.com/jquery/jquery)
* [`jQuery.print`](https://doersguild.github.io/jQuery.print/)
* [`jquery-sticky`](https://github.com/garand/sticky)
* [`jquery-pjax`](https://github.com/defunkt/jquery-pjax)
* [`svg4everybody`](https://github.com/jonathantneal/svg4everybody)
