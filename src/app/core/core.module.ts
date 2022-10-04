import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  AngularPlugin,
  ApplicationinsightsAngularpluginErrorService,
} from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { map, Observable } from 'rxjs';

import { environment } from '@environment/environment';
import { SharedModule } from '@shared/shared.module';
import { AppSettings } from '@shared/models';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

/**
 * Initializes application by pulling app settings and loading application insights when enabled.
 * @param errorHandler
 * @param httpClient
 * @param router
 * @returns @type {Observable<void>}
 */
function appInitializerFactory(
  errorHandler: ErrorHandler,
  httpClient: HttpClient,
  router: Router
): () => Observable<void> {
  return () =>
    httpClient
      .get<AppSettings>(`${window.location.origin}/app.settings.json`)
      .pipe(
        map((appSettings: AppSettings): void => {
          environment.appSettings = appSettings;

          if (!environment.appSettings.azure.applicationInsights.enabled) {
            return;
          }

          const angularPlugin = new AngularPlugin();
          const clickAnalyticsPlugin = new ClickAnalyticsPlugin();
          const clickAnalyticsConfig = {
            autoCapture: true,
            dataTags: {
              useDefaultContentNameOrId: true,
            },
          };
          const appInsights = new ApplicationInsights({
            config: {
              connectionString:
                environment.appSettings.azure.applicationInsights
                  .connectionString,
              extensions: [angularPlugin, clickAnalyticsPlugin],
              extensionConfig: {
                [angularPlugin.identifier]: {
                  router: router,
                  errorServices: [errorHandler],
                },
                [clickAnalyticsPlugin.identifier]: clickAnalyticsConfig,
              },
              enableCorsCorrelation: true,
              enableRequestHeaderTracking: true,
              enableResponseHeaderTracking: true,
              loggingLevelConsole: 1,
            },
          });
          appInsights.loadAppInsights();
        })
      );
}

/**
 * Special Note: The Errorservice has an implicit dependency on the
 * `@microsoft/applicationinsights-analytics-js' extension, which is included
 * with the '@microsoft/applicationinsights-web' module, if the analytics
 * extension is not included during initialization of the SDK this Error Service
 * will not be able to send any caught unhandled errors.
 * @param router
 * @returns @type {GlobalErrorHandlerService} when app insights is disable and @type {ApplicationinsightsAngularpluginErrorService} when enabled.
 */
function errorHandlerFactory(router: Router): ErrorHandler {
  return environment.appSettings.azure.applicationInsights.enabled
    ? new ApplicationinsightsAngularpluginErrorService()
    : new GlobalErrorHandlerService(router);
}

@NgModule({
  imports: [HttpClientModule, SharedModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [ErrorHandler, HttpClient, Router],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useFactory: errorHandlerFactory,
      deps: [Router],
    },
  ],
})
export class CoreModule {}
