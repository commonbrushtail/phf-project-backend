import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmailFormatPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  }
}
