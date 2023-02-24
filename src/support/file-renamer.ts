import { join } from 'path';
import slugify from 'slugify';
import { rename } from 'fs';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

const promisifiedRename = promisify(rename);

@Injectable()
export class FileRenamer {
    private readonly fileSeparator: string;
    
    constructor(private readonly configService: ConfigService) {
        this.fileSeparator = this.configService.get<string>('FILE_SEPARATOR', '/');
    }
    
    async rename({ filePath, itemName }: {
        filePath: string;
        itemName: string;
    }): Promise<string> {
        const pathParts = filePath.split(this.fileSeparator);

        const slugifiedName = slugify(itemName).toLowerCase();

        const finalName = `${slugifiedName}-${pathParts.at(-1)}`;

        pathParts.splice(-1, 1, finalName);

        const partialPath = pathParts.join(this.fileSeparator);

        const currentFilePath = join(__dirname, '..', '..', '..', filePath);
        
        const newFilePath = join(__dirname, '..', '..', '..', partialPath);
        
        await promisifiedRename(currentFilePath, newFilePath);

        return partialPath;
    }

    async renameMulterFiles({images, itemName} :{images: Express.Multer.File[], itemName: string}): Promise<Express.Multer.File[]> {
        return await Promise.all(images.map(async image => ({
            ...image,
            path: await this.rename({ filePath: image.path, itemName: itemName }),
        })));
    }
}