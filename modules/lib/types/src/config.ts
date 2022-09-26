export namespace FrameworkConfig {
  export interface PlatformConfig {
    host: string;
    schema: string;
    port: number;
    url: URL;
  }
  export interface AuthConfig {
    host: string;
    schema: string;
    port: number;
    url: URL;
  }

  export type WebDriverCycle = "run" | "test";

  export interface SeleniumConfig {
    browser: "chrome" | "edge" | "firefox";
    webDriverCycle: WebDriverCycle;
    window: {
      defaultMaximize: boolean;
      width: number;
      height: number;
    };
    webDriversDir: string | undefined;
    headless: boolean;
    chrome: {
      fixChromeDriverVersion: boolean;
    };
    edge: {
      downloadEdgeDriver: boolean;
      fixEdgeDriverVersion: boolean;
    };
  }

  export interface JestConfig {
    maxConcurrency: number;
    timeoutGroup: {
      default: string;
      [extras: PropertyKey]: string;
    };
  }

  export interface All {
    platform: PlatformConfig;
    auth: AuthConfig;
    selenium: SeleniumConfig;
    jest: JestConfig;
  }
}
