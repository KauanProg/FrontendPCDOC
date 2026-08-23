import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { readonly drawerOpen = signal(false); closeDrawer(){this.drawerOpen.set(false)} toggleDrawer(){this.drawerOpen.update(open=>!open)} }
