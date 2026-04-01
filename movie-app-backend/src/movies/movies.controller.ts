import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a favorite movie' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateMovieDto) {
    return this.moviesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies (with search, sort, pagination)' })
  findAll(@CurrentUser() user: { id: string }, @Query() query: QueryMovieDto) {
    return this.moviesService.findAll(user.id, query);
  }

  @Get('genres')
  @ApiOperation({ summary: 'Get distinct genres for the current user' })
  getGenres(@CurrentUser() user: { id: string }) {
    return this.moviesService.getGenres(user.id);
}
  
  @Get(':id')
  @ApiOperation({ summary: 'Get a single movie by ID' })
  findOne(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.moviesService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie' })
  update(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.moviesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  remove(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.moviesService.remove(user.id, id);
  }
}