import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string, query: QueryMovieDto) {
    const { search, sortBy, sortOrder, page, limit, genre } = query;

    const where: any = { userId };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (genre) {
      where.genre = { equals: genre, mode: 'insensitive' };
    }

    const total = await this.prisma.movie.count({ where });

    const movies = await this.prisma.movie.findMany({
      where,
      orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
      skip: ((page || 1) - 1) * (limit || 10),
      take: limit || 10,
    });

    return {
      data: movies,
      meta: {
        total,
        page: page || 1,
        limit: limit || 10,
        totalPages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  async findOne(userId: string, movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return movie;
  }

  async update(userId: string, movieId: string, dto: UpdateMovieDto) {
    await this.findOne(userId, movieId);

    return this.prisma.movie.update({
      where: { id: movieId },
      data: dto,
    });
  }

  async remove(userId: string, movieId: string) {
    await this.findOne(userId, movieId);

    await this.prisma.movie.delete({ where: { id: movieId } });
    return { message: 'Movie deleted successfully' };
  }

  async getGenres(userId: string): Promise<string[]> {
  const movies = await this.prisma.movie.findMany({
    where: { userId, genre: { not: null } },
    select: { genre: true },
    distinct: ['genre'],
    orderBy: { genre: 'asc' },
  });
  return movies.map((m) => m.genre!).filter(Boolean);
}
}
