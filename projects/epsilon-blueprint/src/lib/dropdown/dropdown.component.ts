import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { generateUniqueId } from '../../helpers';
import { DropdownItemInterface, DropdownExtrasInterface } from './dropdown.interface';

@Component({
  selector: 'bp-dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements OnInit {

  @Input() triggerText: string;
  @Input() triggerClasses = '';
  @Input() menuClasses = '';
  @Input() dropDirection: 'up' | 'down' | 'left' | 'right' = 'down';
  @Input() dropdownItems: DropdownItemInterface[] | DropdownExtrasInterface[];
  @Input() bpID: string;
  @Input() hasCaret = true;
  @Input() iconTrigger: string;

  @Output() action = new EventEmitter();

  uuid: string;

  constructor() { }

  ngOnInit(): void {
    // This is for backwards compatibility: remove when removing routerLink option
    this.dropdownItems.forEach(item => {
      if (item.routerLink && !item.bpRouterLink) {
        item.bpRouterLink = item.routerLink;
      }
    });

    if (!this.bpID) {
      this.uuid = 'dropdown' + generateUniqueId().toString();
    } else {
      this.uuid = this.bpID;
    }
  }

  getClasses(item: DropdownItemInterface): string {
    let classes = 'dropdown-item';
    if (item.isDestructive) {
      classes += ' is-destructive';
    }
    if (item.isActive) {
      classes += ' is-active';
    }
    return classes;
  }

  getType(obj: DropdownExtrasInterface): string {
    if (obj.plainText) {
      return 'text';
    } else if (obj.heading) {
      return 'heading';
    } else if (obj.isDivider) {
      return 'divider';
    } else {
      return 'item';
    }
  }

  emitAction(e: string): void {
    this.action.emit(e);
  }

}