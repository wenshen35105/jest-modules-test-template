declare module "@testim/chrome-version" {
  export const getChromeVersion: (includeChromium?: bool) => Promise<string>;
}
