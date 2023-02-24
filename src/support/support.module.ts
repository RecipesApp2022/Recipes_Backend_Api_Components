import { Module } from '@nestjs/common';
import { FileRenamer } from './file-renamer';
import { HashingService } from './hashing.service';

@Module({
    providers: [HashingService, FileRenamer],
    exports: [HashingService, FileRenamer],
})
export class SupportModule {}
