import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { LinksModule } from './links/links.module';
import { RedirectController } from './redirect/redirect.controller';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [PrismaModule, LinksModule, InvitationsModule],
  controllers: [AppController, HealthController, RedirectController],
  providers: [AppService],
})
export class AppModule {}
