import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'Interstellar' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'Christopher Nolan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  director?: string;

  @ApiPropertyOptional({ example: 2014 })
  @IsOptional()
  @IsInt()
  @Min(1888) // first movie ever made
  @Max(2030)
  year?: number;

  @ApiPropertyOptional({ example: 'Sci-Fi' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  genre?: string;

  @ApiPropertyOptional({ example: 9.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({ example: 'A team of explorers travel through a wormhole in space...' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;
}
