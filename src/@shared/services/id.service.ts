import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class IdService {
    generate(id?: string): string {
        return id ? new Types.ObjectId(id).toString() : new Types.ObjectId().toString();
    }
}
