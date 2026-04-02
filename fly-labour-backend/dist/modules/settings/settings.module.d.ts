import { Repository } from 'typeorm';
import { Setting } from './settings.entity';
export declare class SettingsService {
    private repo;
    constructor(repo: Repository<Setting>);
    getAll(): Promise<Record<string, string>>;
    saveAll(data: Record<string, string>): Promise<Record<string, string>>;
}
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<Record<string, string>>;
    getAllAdmin(): Promise<Record<string, string>>;
    saveAll(body: Record<string, string>): Promise<Record<string, string>>;
}
export declare class SettingsModule {
}
