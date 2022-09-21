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
  }

  interface Config {
    platform: PlatformConfig;
    auth: AuthConfig;
    selenium: SeleniumConfig;
  }

  export { PlatformConfig, AuthConfig, SeleniumConfig, WebDriverCycle, Config };
}

export default Config;
