import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  AllExceptionsFilter,
  BadRequestExceptionFilter,
  ForbiddenExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
  ValidationExceptionFilter,
} from './filters';
import { HealthController } from './health.controller';
import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './interceptor/response.interceptor';
import { DatabaseModule } from './db/database.module';
import { UserModule } from './modules/user/user.module';

import { FileManagerModule } from './file-manager/file-manager.module';
import { ServiceModule } from './modules/services/services.module';
import { RoleModule } from './modules/role/role.module';
import { TypeModule } from './modules/type/type.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { StatusModule } from './modules/status/status.module';
import { OptionsModule } from './modules/options/options.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AplicationsModule } from './modules/aplications/aplications.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoriesModule,
    FileManagerModule,
    ServiceModule,
    RoleModule,
    AplicationsModule,
    AccountsModule,
    SubscriptionsModule,
    StatusModule,
    OptionsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },
  ],
})
export class AppModule {}
