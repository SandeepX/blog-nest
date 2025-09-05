import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog/entities/blog.entity';
import { BlogModule } from './blog/blog.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'blog',
      entities: [Blog, User],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    BlogModule,
  ],
})
export class AppModule {}
