import { Expose, Transform, plainToInstance, Exclude } from 'class-transformer';
import { Blog } from './entities/blog.entity';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export class BlogResource {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  author: string;

  @Exclude()
  age: number;

  @Expose()
  @Transform(({ value }) => (value ? `${BASE_URL}${value}` : null))
  image?: string;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  updatedAt: Date;

  static toResource(blog: Blog) {
    return plainToInstance(BlogResource, blog, {
      excludeExtraneousValues: true,
    });
  }

  static toCollection(blogs: Blog[]) {
    return plainToInstance(BlogResource, blogs, {
      excludeExtraneousValues: true,
    });
  }
}
