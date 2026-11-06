import { registerAs } from "@nestjs/config";

/**
 * Same convention as your database and redis config: a `registerAs` namespace, injected
 * with `ConfigType`, so nothing reads `process.env` outside a config file.
 */
export default registerAs('identity', () => ({
    baseUrl: process.env.IDENTITY_BASE_URL ?? '',
    apiKey: process.env.IDENTITY_API_KEY ?? '',
    timeoutMs: Number(process.env.IDENTITY_API_TIMEOUT_MS ?? 5000)
}))