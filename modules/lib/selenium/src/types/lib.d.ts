declare module "@testim/chrome-version" {
  export const getChromeVersion: (includeChromium?: boolean) => Promise<string>;
}
