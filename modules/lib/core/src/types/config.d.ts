namespace Config {
  interface PlatformConfig {
    host: string;
    schema: string;
    port: number;
    url: URL;
  }
  interface AuthConfig {
    host: string;
    schema: string;
    port: number;
    url: URL;
  }

  type WebDriverCycle = "run" | "test";

  interface SeleniumConfig {
    browser: "chrome" | "edge" | "firefox";
    webDriverCycle: WebDriverCycle;
    window: {
      defaultMaxmize: boolean;
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

  interface JestConfig {
    maxConcurrency: number;
    timeoutGroup: {
      default: string;
      [extras: PropertyKey]: string;
    };
  }

  interface Config {
    platform: PlatformConfig;
    auth: AuthConfig;
    selenium: SeleniumConfig;
    jest: JestConfig;
  }

  export {
    PlatformConfig,
    AuthConfig,
    SeleniumConfig,
    WebDriverCycle,
    JestConfig,
    Config,
  };
}

export default Config;
