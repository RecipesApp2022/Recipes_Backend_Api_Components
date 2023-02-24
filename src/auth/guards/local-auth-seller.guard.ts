import {Injectable} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class LocalAuthSellerGuard extends AuthGuard('local-seller') {}
