import { Injectable } from '@nestjs/common';
import { PdfGenerator } from './pdf-generator';
import * as HtmlPdfNode from 'html-pdf-node';

@Injectable()
export class HpnPdfGenerator implements PdfGenerator {
  private readonly options = {
    format: 'A4',
  };

  async generate({ content }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      HtmlPdfNode.generatePdf({ content }, this.options, (err, buffer) => {
        if (err) return reject(err);

        resolve(buffer);
      });
    });
  }
}
