import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import * as crypto from 'crypto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueCode(): Promise<string> {
    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const code = crypto.randomBytes(4).toString('base64url').substring(0, 6);
      const existing = await this.prisma.link.findUnique({ where: { code } });
      if (!existing) {
        return code;
      }
    }
    throw new Error(
      'Failed to generate a unique short code after maximum attempts',
    );
  }

  async create(createLinkDto: CreateLinkDto) {
    const code = await this.generateUniqueCode();
    let expiresAt: Date | null = null;
    if (createLinkDto.expires_at) {
      const dateStr = createLinkDto.expires_at;
      const hasTimezone = /Z|[+-]\d{2}(:\d{2})?$/.test(dateStr);
      expiresAt = new Date(hasTimezone ? dateStr : `${dateStr}Z`);
    }

    return this.prisma.link.create({
      data: {
        code,
        longUrl: createLinkDto.long_url,
        expiresAt,
        tags: createLinkDto.tags || [],
        createdBy: 'anonymous',
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.link.findMany({
      skip,
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findOne(id: string) {
    const link = await this.prisma.link.findUnique({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException(`Link with ID "${id}" not found`);
    }
    return link;
  }

  async findByCode(code: string) {
    const link = await this.prisma.link.findUnique({
      where: { code },
    });
    if (!link) {
      throw new NotFoundException(`Link with code "${code}" not found`);
    }
    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new NotFoundException(`Link with code "${code}" has expired`);
    }

    const now = new Date();
    const timestampBucket = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        0,
        0,
        0,
      ),
    );

    const analyticsId = crypto.randomUUID();
    await this.prisma.$executeRaw`
      INSERT INTO "analytics" ("id", "link_id", "timestamp_bucket", "count", "last_accessed_at")
      VALUES (${analyticsId}, ${link.id}, ${timestampBucket}, 1, NOW())
      ON CONFLICT ("link_id", "timestamp_bucket")
      DO UPDATE SET "count" = "analytics"."count" + 1, "last_accessed_at" = NOW()
    `;

    return link;
  }
}
