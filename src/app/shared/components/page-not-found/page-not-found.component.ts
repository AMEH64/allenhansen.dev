import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ameh-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  host: {
    class: 'flex flex-col justify-center items-center h-screen w-screen gap-3',
  },
})
export class PageNotFoundComponent {
  constructor() {}
}
