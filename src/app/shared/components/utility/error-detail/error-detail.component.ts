import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ErrorDetail } from 'src/app/shared/models/util/error-detail';

@Component({
  selector: 'app-error-detail',
  templateUrl: './error-detail.component.html',
  styleUrls: ['./error-detail.component.scss']
})
export class ErrorDetailComponent implements OnInit {

  @Input('error') error: ErrorDetail;
  @Output('executeAction') executeAction: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  captureAction(codeAction: string): void {
    this.executeAction.emit(codeAction);
  }

}
