namespace Config {
  interface PlatformConfig {
    host: string;
    schema: string;
    port: number;
  }

  interface AuthConfig {
    host: string;
    schema: string;
    port: number;
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
