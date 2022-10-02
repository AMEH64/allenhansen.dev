export interface AppSettings {
  azure: {
    applicationInsights: {
      enabled: boolean;
      connectionString?: string;
    };
  };
}
