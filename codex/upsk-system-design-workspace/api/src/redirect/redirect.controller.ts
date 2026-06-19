import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { LinksService } from '../links/links.service';

@Controller('r')
export class RedirectController {
  constructor(private readonly linksService: LinksService) {}

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    const link = await this.linksService.findByCode(code);
    return res.redirect(HttpStatus.FOUND, link.longUrl);
  }
}
