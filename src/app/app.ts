import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'stream-chat';
import {
  ChatClientService,
  ChannelService,
  StreamI18nService,
  StreamAutocompleteTextareaModule,
  StreamChatModule,
} from 'stream-chat-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule, StreamAutocompleteTextareaModule, StreamChatModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
  ) {}

  async ngOnInit() {
    const apiKey = 'dz5f4d5kzrue';
    const userId = 'royal-pond-4';
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicm95YWwtcG9uZC00IiwiZXhwIjoxNzUwMTU3Mjc4fQ.jEBDzSuFYK9-Mby_erm0uSJ2n8Zr3kDEA8fOnMYZOLE';
    const userName = 'royal';

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?name=${userName}`,
    };

    this.chatService.init(apiKey, user, userToken);
    this.streamI18nService.setTranslation();

    const channel = this.chatService.chatClient.channel('messaging', 'talking-about-angular', {
      name: 'Talking about Angular',
    });
    await channel.create();
    this.channelService.init({
      type: 'messaging',
      id:  'talking-about-angular'
    });
  }
}
