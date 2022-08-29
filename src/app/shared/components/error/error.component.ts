import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ameh-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  host: {
    class: 'flex flex-col justify-center items-center h-screen w-screen gap-3',
  },
})
export class ErrorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
