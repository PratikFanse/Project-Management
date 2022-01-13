import { Injectable, CanActivate, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class RolesGaurd implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredRoles){
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => {
            console.log("user.role",user.role,'role', role) 
            console.log((role==Role.Employee || role==Role.QA || role==Role.Manager) 
            && (user.role === Role.Admin || user.role === Role.Manager))
            if(user.role === role){  
                return user.role === role
            } else if((role==Role.Employee || role==Role.QA || role==Role.Manager) 
                && (user.role === Role.Admin || user.role === Role.Manager)){
                return true
            }
        })
    }
}