import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

interface FileUploadOptions {
  fieldName: string;
  destination: string;
  maxSize?: number;
  fileFilter?: (file: Express.Multer.File) => boolean;
}

export const FileUploadInterceptor = (options: FileUploadOptions) => {
  const multerOptions: MulterOptions = {
    storage: diskStorage({
      destination: options.destination,
      filename: (_req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: options.maxSize ?? 5 * 1024 * 1024 },
    fileFilter: (_req: Request, file: Express.Multer.File, cb) => {
      if (options.fileFilter) {
        const allowed = options.fileFilter(file);
        return allowed
          ? cb(null, true)
          : cb(new Error('File type not allowed'), false);
      }

      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
      }

      cb(null, true);
    },
  };

  return FileInterceptor(options.fieldName, multerOptions);
};
