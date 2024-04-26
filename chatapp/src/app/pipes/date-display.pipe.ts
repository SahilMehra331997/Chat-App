import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'dateDisplay',
  standalone: true
})
export class DateDisplayPipe implements PipeTransform {

  private datePipe=inject(DatePipe)

  transform(value: Timestamp|undefined):string{
    return this.datePipe.transform(value?.toMillis(),'short')??'';
  }

}
