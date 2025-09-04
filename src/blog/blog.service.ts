import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const blog = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(blog);
  }

  async findAll() {
    return this.blogRepository.find();
  }

  async findOne(id: number) {
    return this.blogRepository.findOneBy({ id });
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    await this.blogRepository.update(id, updateBlogDto);
    return this.blogRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.blogRepository.delete(id);
    return { deleted: true };
  }

  async findByAuthor(author: string) {
    return this.blogRepository.find({
      where: { author },
      order: { createdAt: 'DESC' },
    });
  }
}
