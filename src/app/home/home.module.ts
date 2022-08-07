import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '@shared/shared.module';
import { HeroComponent } from './components';

@NgModule({
  declarations: [HomeComponent, HeroComponent],
  imports: [HomeRoutingModule, SharedModule],
})
export class HomeModule {}
