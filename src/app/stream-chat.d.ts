import { DefaultChannelData } from 'stream-chat-angular';

declare module 'stream-chat' {
  // Custom fields used by the SDK are defined in DefaultChannelData
  interface CustomChannelData extends DefaultChannelData {
    // Add as many custom fields as you'd like
  }
}