import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogResource } from './blog.resource';
import { FileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(
    FileUploadInterceptor({
      fieldName: 'image',
      destination: './storage/blogs',
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    if (file) {
      createBlogDto['image'] = `/storage/blogs/${file.filename}`;
    }
    const blog = await this.blogService.create(createBlogDto);
    return BlogResource.toResource(blog);
  }

  @Get()
  async findAll() {
    const blogs = await this.blogService.findAll();
    return BlogResource.toCollection(blogs);
  }

  @Get('author/:author')
  async getBlogsByAuthor(@Param('author') author: string) {
    const blogs = await this.blogService.findByAuthor(author);
    if (!blogs || blogs.length === 0) {
      throw new HttpException(
        'No blogs found for this author',
        HttpStatus.NOT_FOUND,
      );
    }
    return BlogResource.toCollection(blogs);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const blog = await this.blogService.findOne(id);
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    return BlogResource.toResource(blog);
  }

  @Put(':id')
  @UseInterceptors(
    FileUploadInterceptor({
      fieldName: 'image',
      destination: './storage/blogs',
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    if (file) {
      updateBlogDto['image'] = `/storage/blogs/${file.filename}`;
    }
    const blog = await this.blogService.update(id, updateBlogDto);
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    return BlogResource.toResource(blog);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const blog = await this.blogService.findOne(id);
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    if (blog.image) {
      const imagePath = join(process.cwd(), blog.image);
      try {
        await unlink(`./storage${imagePath}`);
      } catch (err) {
        console.warn(`Failed to delete image file: ${blog.image}`, err);
      }
    }
    await this.blogService.remove(id);
    return { message: 'Blog deleted successfully' };
  }
}
