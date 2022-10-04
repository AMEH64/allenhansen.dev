import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorService } from '@microsoft/applicationinsights-angularplugin-js';

@Injectable()
export class GlobalErrorHandlerService implements IErrorService, ErrorHandler {
  constructor(private readonly router: Router) {}

  public handleError(_error: any): void {
    this.router.navigate(['/error']);
  }
}
