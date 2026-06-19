import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';

@Module({
  controllers: [InvitationsController],
  providers: [],
})
export class InvitationsModule {}
