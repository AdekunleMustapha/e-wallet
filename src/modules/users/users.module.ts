import { Module } from "@nestjs/common";
import { NIN_HASHER } from "./domain/services/nin-hasher.port";
import { HmacNINHasher } from "./infrastructure/hmac-nin-hasher.service";

@Module({
    providers: [{provide: NIN_HASHER, useClass: HmacNINHasher}],
    exports: [NIN_HASHER],
})
export class UsersModule {}