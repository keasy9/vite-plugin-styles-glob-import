# vite-plugin-styles-glob-import

Плагин для vite, позволяющий использовать маску при импорте стилевых файлов.

Перед сборкой конвертирует это:
```
@import 'components/**/*.less';
```
В это:
```
@import 'components/button/button.less';
@import 'components/cards/news-card.less';
@import 'components/cards/user-card.less';
```

По умолчанию работает с css, less, sass и scss файлами, но типы файлов можно переопределить:
```
stylesGlobImport({ fileExtensions: ['less'] })
```

А ещё можно указать пути, из которых импортировать файлы не надо:
```
stylesGlobImport({ ignorePaths: ['/build/*', '/libs/**/*.css'] })
```
