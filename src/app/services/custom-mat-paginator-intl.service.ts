import { Injectable } from '@angular/core';
//import { MatPaginatorIntl } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CustomMatPaginatorIntlService //extends MatPaginatorIntl
{
  itemsPerPageLabel = 'registros por página';
  nextPageLabel = 'siguiente';
  previousPageLabel = 'anterior';
  firstPageLabel = 'primera';
  lastPageLabel = 'última';

  constructor() { //super();
  }

  /*
  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 od ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' / ' + length;
  }
  */
}
