import { Component, OnInit } from '@angular/core';
import {GameStateService, Move, Player} from '../../services/game-state.service';
import {combineLatest, map, pairwise, tap} from 'rxjs';

@Component({
  selector: 'app-match-page',
  templateUrl: './match-page.component.html',
  styleUrls: ['./match-page.component.scss']
})
export class MatchPageComponent implements OnInit {
  public readonly moveTypes = Move;
  public lastWinningName: string | null = null;

  playerOne: Player | undefined;
  playerTwo: Player | undefined;

  playerWinner: Player | undefined;

  isPlayerOneTurn = true;
  isRoundEnd = false;

  constructor(private gameState: GameStateService) {
  }

  ngOnInit(): void {
    combineLatest([
      this.gameState.playerOne,
      this.gameState.playerTwo,
    ]).pipe(
      tap(([p1, p2]) => {
        if (p1 && p2) {
          this.isPlayerOneTurn = p1.lastMove === null;

          this.playerOne = p1;
          this.playerTwo = p2;

          this.isRoundEnd = p1.lastMove !== null && p2.lastMove !== null;
        }
      }),
      map(([p1, p2]) => {
        if (p1 && p2) {
          return [p1.score, p2.score];
        } else {
          return [];
        }
      }),
      pairwise(),
    ).subscribe(([[p1, p2], [p1n, p2n]]) => {
      // determine if win/loss/tie, depending on if score is incremented
      if (p2n > p2) {
        this.playerWinner = this.playerTwo;
      } else if (p1n > p1) {
        this.playerWinner = this.playerOne;
      } else {
        this.playerWinner = undefined;
      }
    });
  }

  move(moveType: Move) {
    if (this.isPlayerOneTurn) {
      this.gameState.playerOneMove(moveType);
    } else {
      this.gameState.playerTwoMove(moveType);
    }
  }

  playAgain() {
    this.gameState.playAgain();
  }
}
