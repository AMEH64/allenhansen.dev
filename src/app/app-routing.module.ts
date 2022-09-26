import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent, PageNotFoundComponent } from '@shared/components';

const routes: Routes = [
  {
    path: '',
    title: 'Allen Hansen',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  { path: 'error', title: 'Error', component: ErrorComponent },
  { path: '**', title: 'Not Found', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
