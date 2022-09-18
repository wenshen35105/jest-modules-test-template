namespace Config {
  interface PlatformConfig {
    host: string;
    schema: string;
    port: number;
  }

  interface SeleniumConfig {
    browser: "chrome" | "edge" | "firefox";
  }

  interface Config {
    platform: PlatformConfig;
    selenium: SeleniumConfig;
  }

  export { PlatformConfig, SeleniumConfig, Config };
}

export default Config;
