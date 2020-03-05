import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bp-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  @Input() element = 'span';
  @Input() classes = 'badge badge-primary';
  @Input() text: string;

  constructor() { }

  ngOnInit() {
    this.validation();
  }

  validation() {
    if (!this.text) {
      let err = new Error('\'text\' is a required Input of bp-badge');
      err.name = 'Missing Input';
      throw err;
    }
  }
}