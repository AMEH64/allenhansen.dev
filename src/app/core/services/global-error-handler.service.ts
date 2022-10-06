import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { environment } from '@environment/environment';

@Injectable()
export class GlobalErrorHandlerService
  extends ApplicationinsightsAngularpluginErrorService
  implements ErrorHandler
{
  constructor(private readonly router: Router) {
    super();
  }

  public override handleError(error: any): void {
    if (environment.appSettings.azure.applicationInsights.enabled) {
      super.handleError(error);
    } else {
      console.error(error);
    }

    this.router.navigate(['/error']);
  }
}
