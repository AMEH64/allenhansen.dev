import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faEnvelope,
  faEnvelopeOpenText,
  faMailBulk,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

import { ErrorComponent, PageNotFoundComponent } from './components';

@NgModule({
  declarations: [ErrorComponent, PageNotFoundComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [CommonModule, FontAwesomeModule],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faArrowDown, faEnvelope, faGithub, faLinkedin, faTwitter);
  }
}
