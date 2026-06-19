import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  private mapLinkResponse(link: any) {
    const port = process.env.PORT || 3000;
    return {
      id: link.id,
      code: link.code,
      short_url: `http://localhost:${port}/r/${link.code}`,
      long_url: link.longUrl,
      created_at: link.createdAt,
      expires_at: link.expiresAt,
      tags: link.tags,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLinkDto: CreateLinkDto) {
    const link = await this.linksService.create(createLinkDto);
    return this.mapLinkResponse(link);
  }

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const links = await this.linksService.findAll(pageNum, limitNum);
    return links.map((link) => this.mapLinkResponse(link));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const link = await this.linksService.findOne(id);
    return this.mapLinkResponse(link);
  }
}
