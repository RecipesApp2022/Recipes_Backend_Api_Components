export interface PdfGenerator {
    generate(data: {content: string}): Promise<Buffer>;
}

export const PdfGenerator = Symbol.for('PdfGenerator');