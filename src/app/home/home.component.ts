import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ameh-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    class: 'block container mx-auto px-8 md:px-14 lg:px-16',
  },
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
