import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app-layout.html',
  styleUrl:'./app-layout.scss'
})
export class AppLayout {}
