import { Module } from "@nestjs/common";
import { NIN_HASHER, BVN_HASHER } from "./domain/services";
import { HmacNINHasher, HmacBVNHasher } from "./infrastructure/services";

@Module({
    providers: [
        {provide: NIN_HASHER, useClass: HmacNINHasher},
        {provide: BVN_HASHER, useClass: HmacBVNHasher}
    ],
    exports: [NIN_HASHER, BVN_HASHER],
})
export class UsersModule {}