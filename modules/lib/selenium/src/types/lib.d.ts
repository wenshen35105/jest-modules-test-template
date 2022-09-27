declare module "@testim/chrome-version" {
  export const getChromeVersion: (includeChromium?: boolean) => Promise<string>;
}
declare module "jest-image-snapshot" {
  export const toMatchImageSnapshot: (expect: string) => {
    message: () => string;
    pass: boolean;
  };
}
