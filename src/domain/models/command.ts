import { type ApplicationCommandType } from '@/domain/usecases';

export type DiscordCommandModel = {
  id: string;
  application_id: string;
  version: string;
  default_member_permissions: null;
  type: ApplicationCommandType;
  name: string;
  name_localizations: null;
  description: string;
  description_localizations: null;
  dm_permission: boolean;
  contexts: null;
  integration_types: [0];
  nsfw: boolean;
};
