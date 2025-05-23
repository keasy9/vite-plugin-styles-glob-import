import { Plugin } from 'vite';

interface PluginOptions {
    fileExtensions?: string[];
    ignorePaths?: string[];
}
interface TransformResult {
    code: string;
    map: null;
}
declare function stylesGlobImport(options?: PluginOptions): Plugin;

export { type PluginOptions, type TransformResult, stylesGlobImport as default };
