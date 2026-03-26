import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class EmployerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
