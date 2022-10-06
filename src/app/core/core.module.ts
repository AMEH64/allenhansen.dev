import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { map, Observable } from 'rxjs';

import { environment } from '@environment/environment';
import { SharedModule } from '@shared/shared.module';
import { AppSettings } from '@shared/models';
import { GlobalErrorHandlerService } from './services';

/**
 * Initializes application by pulling app settings and loading application insights when enabled.
 * @param errorHandler
 * @param httpClient
 * @param router
 * @returns @type {Observable<void>}
 */
function appInitializerFactory(
  httpClient: HttpClient,
  router: Router
): () => Observable<void> {
  return () =>
    httpClient
      .get<AppSettings>(`${window.location.origin}/app.settings.json`)
      .pipe(
        map((appSettings: AppSettings): void => {
          environment.appSettings = appSettings;
          initializeAppInsights(router);
        })
      );
}

/**
 * Initializes application insights once app has finished initializing.
 * @param appInitiStatus
 * @param router
 * @returns @type {ApplicationInsights} when enabled and unedfined when disabled or on error.
 */
function initializeAppInsights(router: Router): void {
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
        environment.appSettings.azure.applicationInsights.connectionString,
      extensions: [angularPlugin, clickAnalyticsPlugin],
      extensionConfig: {
        [angularPlugin.identifier]: {
          router: router,
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
}

@NgModule({
  imports: [HttpClientModule, SharedModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [HttpClient, Router],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
  ],
})
export class CoreModule {}
