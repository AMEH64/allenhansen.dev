import { AppSettings } from '@shared/models';

export const environment = {
  production: true,
  appSettings: {
    azure: {
      applicationInsights: { enabled: false, connectionString: undefined },
    },
  } as AppSettings,
};
