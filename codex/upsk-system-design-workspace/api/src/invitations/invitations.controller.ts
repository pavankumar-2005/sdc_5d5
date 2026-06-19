import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@Controller()
export class InvitationsController {
  @Post('teams/:id/invitations')
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(
    @Param('id') id: string,
    @Body() createDto: CreateInvitationDto,
  ) {
    return {
      id: 'mock-invitation-id',
      team_id: id,
      invitee_email: createDto.invitee_email,
      status: 'PENDING',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    };
  }

  @Get('teams/:id/invitations')
  async listInvitations(@Param('id') id: string) {
    return [
      {
        id: 'mock-invitation-id',
        team_id: id,
        invitee_email: 'test@example.com',
        status: 'PENDING',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      },
    ];
  }

  @Patch('invitations/:id/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptInvitation(@Param('id') id: string) {
    return;
  }

  @Patch('invitations/:id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectInvitation(@Param('id') id: string) {
    return;
  }
}
