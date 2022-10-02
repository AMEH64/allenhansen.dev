import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  AngularPlugin,
  ApplicationinsightsAngularpluginErrorService,
} from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '@environment/environment';
import { SharedModule } from '@shared/shared.module';
import { AppSettings } from '@shared/models';

function appInitializerFactory(
  httpClient: HttpClient,
  router: Router
): () => Observable<any> {
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
          const appInsights = new ApplicationInsights({
            config: {
              connectionString:
                environment.appSettings.azure.applicationInsights
                  .connectionString,
              extensions: [angularPlugin],
              extensionConfig: {
                [angularPlugin.identifier]: { router: router },
              },
            },
          });
          appInsights.loadAppInsights();
        }),
        catchError((error: any): Observable<void> => {
          console.error(error);
          return of(undefined);
        })
      );
}

/**
 * Special Note: The Errorservice has an implicit dependency on the
 * `@microsoft/applicationinsights-analytics-js' extension, which is included
 * with the '@microsoft/applicationinsights-web' module, if the analytics
 * extension is not included during initialization of the SDK this Error Service
 * will not be able to send any caught unhandled errors.
 * @returns
 */
function errorHandlerFactory(): () => ErrorHandler {
  return () =>
    environment.appSettings.azure.applicationInsights.enabled
      ? new ApplicationinsightsAngularpluginErrorService()
      : new ErrorHandler();
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
      useFactory: errorHandlerFactory,
    },
  ],
})
export class CoreModule {}
