import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import * as multer from 'multer';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants/core';

@ApiTags('File Upload')
@Controller('upload')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) { }

    @Public()
    @Post('single')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
    async uploadSingle(@UploadedFile() file: Express.Multer.File) {
        return this.s3Service.uploadFile(file);
    }

    @Public()
    @Post('multiple')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('files', 10, { storage: multer.memoryStorage() }))
    async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
        return this.s3Service.uploadMultipleFiles(files);
    }
}
