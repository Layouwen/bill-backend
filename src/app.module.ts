import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserInitMiddleware } from './middleware/UserInitMiddleware';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { TopicModule } from './modules/topic/topic.module';
import { UsersModule } from './modules/users/users.module';
import { RecordModule } from './modules/record/record.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CheckInModule } from './modules/check-in/check-in.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/../../bill-frontend/dist',
    }),
    AuthModule,
    UsersModule,
    RecordModule,
    CategoryModule,
    TopicModule,
    CheckInModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInitMiddleware).forRoutes('*');
  }
}
