import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
export declare class CreateContactDto {
    name: string;
    email: string;
    phone?: string;
    message: string;
}
export declare class ContactService {
    private repo;
    constructor(repo: Repository<Contact>);
    create(dto: CreateContactDto): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    markRead(id: string): Promise<Contact>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    create(dto: CreateContactDto): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    markRead(id: string): Promise<Contact>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export declare class ContactModule {
}
