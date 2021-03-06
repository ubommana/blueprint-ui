import { Component, OnInit, Input, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { generateUniqueId } from '../../helpers';
import { RouterLinkActive } from '@angular/router';

interface Item {
  text: string;
  route?: string;
  children?: Item[];
  isExpanded?: boolean;
}[];

@Component({
  selector: 'bp-nav-secondary',
  templateUrl: './nav-secondary.component.html',
  styleUrls: ['./nav-secondary.component.scss']
})
export class NavSecondaryComponent implements OnInit {

  @Input() title: string;
  @Input() items: Item[];
  @Input() shouldRouteMatchExact = false;
  @Input() areItemsExpanded = false;
  @Input() bpID: string;

  @ViewChildren(RouterLinkActive, { read: ElementRef })
  linkRefs: QueryList<ElementRef>;

  uuid: string;
  activeItem: string;

  constructor() { }

  ngOnInit(): void {
    this.validate();
    setTimeout(() => {
      this.activeItem = this.linkRefs.toArray()
        .find(link => link.nativeElement.classList.contains('active'))
        .nativeElement.textContent.trim();
      for (const item of this.items) {
        this.findActive(item, null);
      }
    }, 0);

    if (!this.bpID) {
      this.uuid = 'navSecondary' + generateUniqueId().toString();
    } else {
      this.uuid = this.bpID;
    }
  }

  findActive(node: Item, parent: Item): Item {
    if (node.text === this.activeItem) {
      if (parent) {
        parent.isExpanded = true;
      }
      return node;
    } else if (node.children) {
      for (const item of node.children) {
        this.findActive(item, node);
      }
    }
  }

  validate(): void {
    this.items.forEach(item => {
      if (!item.text) {
        const err = new Error(`Missing text in ${JSON.stringify(item)}`);
        err.name = 'Missing Input';
        throw err;
      }
      if (item.route === undefined && !item.children) {
        const err = new Error(`Nav item needs either a route or children in ${JSON.stringify(item)}`);
        err.name = 'Missing Input';
        throw err;
      }
      if (item.route !== undefined && item.children) {
        const err = new Error(`Nav item can't have both a route and children in ${JSON.stringify(item)}`);
        err.name = 'Invalid Input';
        throw err;
      }
    });
  }

}