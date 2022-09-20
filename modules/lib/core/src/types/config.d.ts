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

  interface SeleniumConfig {
    browser: "chrome" | "edge" | "firefox";
  }

  interface Config {
    platform: PlatformConfig;
    auth: AuthConfig;
    selenium: SeleniumConfig;
  }

  export { PlatformConfig, AuthConfig, SeleniumConfig, Config };
}

export default Config;
