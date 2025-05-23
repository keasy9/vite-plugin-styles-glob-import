import {it, describe, expect, vi} from 'vitest';
import sassGlobImportPlugin from '../src';

describe('корректная конвертация импортов', () => {
    const plugin: any = sassGlobImportPlugin();

    it('SCSS import', () => {
        const source = `
body {}
@import "files/scss/*.scss";
@import "files/sass/*.sass";
.some-class {}
`;

        const expected = `
body {}
@import "files/scss/a.scss";
@import "files/scss/b.scss";
@import "files/sass/a.sass";
@import "files/sass/b.sass";
.some-class {}
`;
        const path = __dirname + '/virtual-file.scss';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('SCSS import dir', () => {
        const source = `
body {}
@import "files/**/*.scss";
@import "files/**/*.sass";
.some-class {}
`;

        const expected = `
body {}
@import "files/scss/a.scss";
@import "files/scss/b.scss";
@import "files/sass/a.sass";
@import "files/sass/b.sass";
.some-class {}
`;
        const path = __dirname + '/virtual-file.scss';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('SCSS use', () => {
        const source = `
body {}
@use "files/scss/*.scss";
@use "files/sass/*.sass";
.some-class {}
`;

        const expected = `
body {}
@use "files/scss/a.scss";
@use "files/scss/b.scss";
@use "files/sass/a.sass";
@use "files/sass/b.sass";
.some-class {}
`;
        const path = __dirname + '/virtual-file.scss';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('SCSS use dir', () => {
        const source = `
body {}
@use "files/**/*.scss";
@use "files/**/*.sass";
.some-class {}
`;

        const expected = `
body {}
@use "files/scss/a.scss";
@use "files/scss/b.scss";
@use "files/sass/a.sass";
@use "files/sass/b.sass";
.some-class {}
`;
        const path = __dirname + '/virtual-file.scss';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('LESS import', () => {
        const source = `
body {}
@import "files/less/*.less";
.some-class {}
`;

        const expected = `
body {}
@import "files/less/a.less";
@import "files/less/b.less";
.some-class {}
`;
        const path = __dirname + '/virtual-file.less';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('LESS import dir', () => {
        const source = `
body {}
@import "files/**/*.less";
.some-class {}
`;

        const expected = `
body {}
@import "files/less/a.less";
@import "files/less/b.less";
.some-class {}
`;
        const path = __dirname + '/virtual-file.less';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('CSS import', () => {
        const source = `
body {}
@import "files/css/*.css";
.some-class {}
`;

        const expected = `
body {}
@import "files/css/a.css";
@import "files/css/b.css";
.some-class {}
`;
        const path = __dirname + '/virtual-file.css';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('CSS import dir', () => {
        const source = `
body {}
@import "files/**/*.css";
.some-class {}
`;

        const expected = `
body {}
@import "files/css/a.css";
@import "files/css/b.css";
.some-class {}
`;
        const path = __dirname + '/virtual-file.css';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });
});

describe('игнорирование ошибочного синтаксиса', () => {
    const plugin: any = sassGlobImportPlugin();

    it('LESS use', () => {
        const source = `
body {}
@use "files/**/*.less";
@use "files/**/*.scss";
.some-class {}
`;
        const expected = `
body {}
@use "files/**/*.less";
@use "files/**/*.scss";
.some-class {}
`;
        const path = __dirname + '/virtual-file.less';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('CSS use', () => {
        const source = `
body {}
@use "files/**/*.css";
@use "files/**/*.scss";
.some-class {}
`;
        const expected = `
body {}
@use "files/**/*.css";
@use "files/**/*.scss";
.some-class {}
`;
        const path = __dirname + '/virtual-file.css';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });

    it('SCSS use CSS', () => {
        const source = `
body {}
@use "files/**/*.css";
.some-class {}
`;
        const expected = `
body {}
@use "files/**/*.css";
.some-class {}
`;
        const path = __dirname + '/virtual-file.scss';
        expect(plugin.transform(source, path)?.code).toEqual(expected);
    });
});
