import { Pipe, PipeTransform } from '@angular/core';
import { filterOps } from '../model';

@Pipe({
  name: 'opName'
})
export class OpNamePipe implements PipeTransform {

  transform(value: string): string {
    const ops =  filterOps.filter(op => op.key === value);
    if(ops.length > 0){
      return ops[0].value;
    }
    return value;
  }

}
