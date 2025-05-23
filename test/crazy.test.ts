import {it, describe, expect, vi} from 'vitest';
import sassGlobImportPlugin from '../src';

describe('корректная конвертация импортов', () => {
    // каким бы уродливым ни был код, его нужно поддерживать, до тех пор пока он синтаксически корректен

    const plugin: any = sassGlobImportPlugin();

    it('SCSS import css', () => {
        const source = `
body {}
/* почему тут комментарий? */ @import "files/**/*.css"; /* да ещё и импорты дублируются */
@import "files/**/*.css";
.some-class {}
`;
        const expected = `
body {}
/* почему тут комментарий? */ @import "files/css/a.css";
@import "files/css/b.css"; /* да ещё и импорты дублируются */
@import "files/css/a.css";
@import "files/css/b.css";
.some-class {}
`;
        const path = __dirname + '/virtual-file.scss';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('LESS import css', () => {
        const source = `
body {}
/* почему тут комментарий? */ @import "files/**/*.css"; /* да ещё и импорты дублируются */
@import "files/**/*.css";
.some-class {}
`;
        const expected = `
body {}
/* почему тут комментарий? */ @import "files/css/a.css";
@import "files/css/b.css"; /* да ещё и импорты дублируются */
@import "files/css/a.css";
@import "files/css/b.css";
.some-class {}
`;
        const path = __dirname + '/virtual-file.less';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });
});
