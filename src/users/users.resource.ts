import { Expose, plainToInstance, Exclude } from 'class-transformer';
import { User } from './entities/user.entity';

export class UserResource {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  content: string;

  @Exclude()
  password: string;

  static toResource(user: User) {
    return plainToInstance(UserResource, user, {
      excludeExtraneousValues: true,
    });
  }

  static toCollection(users: User[]) {
    return plainToInstance(UserResource, users, {
      excludeExtraneousValues: true,
    });
  }
}
