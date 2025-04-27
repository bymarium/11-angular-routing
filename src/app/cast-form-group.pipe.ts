import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'castFormGroup'
})
export class CastFormGroupPipe implements PipeTransform {

  transform(value: AbstractControl<any, any>): FormGroup {
    return value as FormGroup;
  }
}
