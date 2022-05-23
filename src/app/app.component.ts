import {Component, OnInit} from '@angular/core';
import {GameStateService} from '../services/game-state.service';
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public gameStarted = false;

  constructor(public gameStateService: GameStateService) {
  }

  ngOnInit() {
    combineLatest([this.gameStateService.playerOne, this.gameStateService.playerTwo]).subscribe(([p1, p2]) => {
      this.gameStarted = Boolean(p1) && Boolean(p2);
    });
  }

  restart() {
    this.gameStateService.reset();
  }
}
