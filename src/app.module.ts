import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserInitMiddleware } from './middleware/UserInitMiddleware';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CompatibleModule } from './modules/compatible/compatible.module';
import { FollowModule } from './modules/follow/follow.module';
import { SystemNotifyModule } from './modules/system-notify/system-notify.module';
import { ToolsModule } from './modules/tools/tools.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user/user.module';
import { RecordModule } from './modules/record/record.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CheckInModule } from './modules/check-in/check-in.module';
import { ChartsModule } from './modules/charts/charts.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/../../frontend/dist',
    }),
    AuthModule,
    UserModule,
    RecordModule,
    CategoryModule,
    TopicModule,
    CheckInModule,
    FollowModule,
    ToolsModule,
    SystemNotifyModule,
    CompatibleModule,
    ChartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInitMiddleware).forRoutes('*');
  }
}
