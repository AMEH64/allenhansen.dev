import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'block h-full w-full',
  },
})
export class AppComponent {
  title = 'ameh';
}
