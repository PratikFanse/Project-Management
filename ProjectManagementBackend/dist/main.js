"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./component/app/app.module");
const cookieParser = require("cookie-parser");
const nestjs_sentry_1 = require("@ntegral/nestjs-sentry");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
    app.useLogger(nestjs_sentry_1.SentryService.SentryServiceInstance());
    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3000', 'http://13.58.47.84']
    });
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map