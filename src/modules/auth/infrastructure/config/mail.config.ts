import { registerAs } from "@nestjs/config";

export default registerAs("mail", () => ({
    host: process.env.MAIL_HOST ?? '',
    port: Number(process.env.MAIL_PORT ?? 587),
    password: process.env.MAIL_PASSWORD ?? '',
    from: process.env.MAIL_FROM ?? "no-reply@e-wallet.com",
    user: process.env.MAIL_USER ?? '',
    secure: Boolean(process.env.MAIL_SECURE ?? true)
}))