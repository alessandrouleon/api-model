import * as bcrypt from "bcryptjs";
import { ICryptoPassword } from "./crypto-password.interface";

export class EncryptPassword implements ICryptoPassword {
    private readonly saltRounds = 10;

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
