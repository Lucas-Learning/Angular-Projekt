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
  selector: 'app-chat',
  standalone: true,
  imports: [
    TranslateModule,
    StreamAutocompleteTextareaModule,
    StreamChatModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat implements OnInit {
  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
  ){


    const apiKey = 'dz5f4d5kzrue';
    const userId = 'dawn-tree-5';
    const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGF3bi10cmVlLTUiLCJleHAiOjE3NTAxNzc1MDd9._JGoCfLpsh1bAukNF3VJP1b9NGdRI6V99uhhlu-rfJY';
    const userName = 'dawn';

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?name=${userName}`,
    };

    this.chatService.init(apiKey, user, userToken);
    this.streamI18nService.setTranslation();
  
  }
    async ngOnInit() {
      const channel = this.chatService.chatClient.channel('messaging', 'talking-about-angular', {
        // add as many custom fields as you'd like
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png',
        name: 'Talking about Angular',
      });
      await channel.create();
      this.channelService.init({
        type: 'messaging',
        id: { $eq: 'talking-about-angular' },
      });
    }
  }
