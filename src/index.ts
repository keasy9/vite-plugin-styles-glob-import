import { Plugin } from "vite";
import path from 'path';
import { globSync } from 'glob';

export interface PluginOptions {
    fileExtensions?: string[],
    ignorePaths?: string[],
}

export interface TransformResult {
    code: string,
    map: null,
}

export default function stylesGlobImport(options: PluginOptions = {}): Plugin {
    options.fileExtensions ??= ['css', 'less', 'sass', 'scss'];
    options.ignorePaths ??= [];

    const sassExtensions = ['sass', 'scss'];

    const importExtensions = `(${options.fileExtensions.join('|')})`;

    const importRegex = new RegExp(`(@import)\\s+["']([^"']+\\*[^"']*(\\.${importExtensions}?))["'];?`, 'gm');
    const useRegex = new RegExp(`(@use)\\s+["']([^"']+\\*[^"']*(\\.(sass|scss)?))["'];?`, 'gm');

    const transform = (fileContent: string, filePath: string): TransformResult => {
        const ext = filePath.substring((filePath.lastIndexOf('.') + 1));

        if (options.fileExtensions!.indexOf(ext) === -1) {
            return {
                code: fileContent,
                map: null,
            };
        }

        const basePath = path.dirname(filePath);

        const comma = ext === 'sass' ? '' : ';'; // в sass отступы вместо ';'

        const replaceCallback = (match: string, statement: string, globPattern: string): string => {
            const files = globSync(path.join(basePath, globPattern), {
                ignore: options.ignorePaths,
                cwd: './',
                windowsPathsNoEscape: true,
            }).sort((a, b) => a.localeCompare(b, 'en'));

            if (!files.length) return '';

            const imports: string[] = [];
            files.forEach(file => {
                imports.push(`${statement} "${path.relative(basePath, file)}"${comma}`);
            });

            return imports.join('\n');
        };

        fileContent = fileContent.replace(importRegex, replaceCallback);

        // в sass/scss кроме @import есть @use
        if (sassExtensions.indexOf(ext) !== -1) {
            fileContent = fileContent.replace(useRegex, replaceCallback);
        }

        return {
            code: fileContent,
            map: null,
        };
    };

    return {
        name: 'styles-glob-import',
        enforce: 'pre',

        transform: transform,
    };
}