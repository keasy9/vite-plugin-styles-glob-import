// src/index.ts
import path from "path";
import { globSync } from "glob";
function stylesGlobImport(options = {}) {
  options.fileExtensions ??= ["css", "less", "sass", "scss"];
  options.ignorePaths ??= [];
  const sassExtensions = ["sass", "scss"];
  const importExtensions = `(${options.fileExtensions.join("|")})`;
  const importRegex = new RegExp(`(@import)\\s+["']([^"']+\\*[^"']*(\\.${importExtensions}?))["'];?`, "gm");
  const useRegex = new RegExp(`(@use)\\s+["']([^"']+\\*[^"']*(\\.(sass|scss)?))["'];?`, "gm");
  const transform = (fileContent, filePath) => {
    const ext = filePath.substring(filePath.lastIndexOf(".") + 1);
    if (options.fileExtensions.indexOf(ext) === -1) {
      return {
        code: fileContent,
        map: null
      };
    }
    const basePath = path.dirname(filePath);
    const comma = ext === "sass" ? "" : ";";
    const replaceCallback = (match, statement, globPattern) => {
      const files = globSync(path.join(basePath, globPattern), {
        ignore: options.ignorePaths,
        cwd: "./",
        windowsPathsNoEscape: true
      }).sort((a, b) => a.localeCompare(b, "en"));
      if (!files.length) return "";
      const imports = [];
      files.forEach((file) => {
        imports.push(`${statement} "${path.relative(basePath, file)}"${comma}`);
      });
      return imports.join("\n");
    };
    fileContent = fileContent.replace(importRegex, replaceCallback);
    if (sassExtensions.indexOf(ext) !== -1) {
      fileContent = fileContent.replace(useRegex, replaceCallback);
    }
    return {
      code: fileContent,
      map: null
    };
  };
  return {
    name: "styles-glob-import",
    enforce: "pre",
    transform
  };
}
export {
  stylesGlobImport as default
};
