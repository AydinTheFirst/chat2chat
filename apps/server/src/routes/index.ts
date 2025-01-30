import { AuthModule } from "./auth";
import { ChannelsModule } from "./channels/channels.module";
import { MessagesModule } from "./messages/messages.module";
import { UsersModule } from "./users";

export const AppRoutes = [
  AuthModule,
  UsersModule,
  MessagesModule,
  ChannelsModule,
];
