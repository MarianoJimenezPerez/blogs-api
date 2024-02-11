import { HttpException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    private usersService: UsersService,
  ) {}
  async create(blogDto: CreateBlogDto): Promise<Blog> {
    const author: User | HttpException = await this.usersService.findOne(
      blogDto.authorId,
    );

    if (author instanceof HttpException) {
      throw author;
    }

    const blog = this.blogRepository.create({ ...blogDto, author });
    return await this.blogRepository.save(blog);
  }
  async findAll() {
    return await this.blogRepository.find({});
  }

  async findOne(id: number) {
    return await this.blogRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    return await this.blogRepository.update({ id }, updateBlogDto);
  }

  async remove(id: number) {
    return await this.blogRepository.delete({ id });
  }
}
