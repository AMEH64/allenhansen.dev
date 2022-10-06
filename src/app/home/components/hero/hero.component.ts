import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ameh-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  host: {
    class:
      'h-screen w-full flex flex-col-reverse md:flex-row justify-center items-center gap-3',
  },
})
export class HeroComponent {
  constructor() {}
}
