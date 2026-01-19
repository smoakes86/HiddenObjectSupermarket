import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scottmoakes.SuperMarketHiddenObject',
  appName: 'Hidden Object Supermarket',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
