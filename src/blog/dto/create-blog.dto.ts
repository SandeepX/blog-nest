import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  age?: number;
}
