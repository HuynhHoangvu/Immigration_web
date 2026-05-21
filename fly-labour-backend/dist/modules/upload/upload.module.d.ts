import { GcsService } from '../../common/services/gcs.service';
export declare class UploadController {
    private gcsService;
    constructor(gcsService: GcsService);
    uploadCv(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadAvatar(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
}
export declare class UploadModule {
}
