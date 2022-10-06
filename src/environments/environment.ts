import { AppSettings } from '@shared/models';

export const environment = {
  production: false,
  appSettings: {
    azure: {
      applicationInsights: { enabled: false, connectionString: undefined },
    },
  } as AppSettings,
};
