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
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  async findAll() {
    return this.blogService.findAll();
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
    return blogs;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const blog = await this.blogService.findOne(id);
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    return blog;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const blog = await this.blogService.update(id, updateBlogDto);
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    return blog;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.blogService.remove(id);
    if (!deleted)
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    return null;
  }
}
