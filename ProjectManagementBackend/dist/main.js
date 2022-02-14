"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./component/app/app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3000', 'http://13.58.47.84']
    });
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map