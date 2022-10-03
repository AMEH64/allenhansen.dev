export interface AppSettings {
  repositoryUrl: string;
  azure: {
    applicationInsights: {
      enabled: boolean;
      connectionString?: string;
    };
  };
}
