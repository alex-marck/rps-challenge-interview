import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';

export interface Player {
  name: string | null;
  lastMove: Move | null;
  score: number;
  isBot: boolean;
}

export interface MoveState {
  playerOne: Move | null;
  playerTwo: Move | null;
}

export enum Move {
  Rock = 'Rock',
  Paper = 'Paper',
  Scissors = 'Scissors',
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  public playerOne: BehaviorSubject<Player | undefined> = new BehaviorSubject<Player | undefined>(undefined);
  public playerTwo: BehaviorSubject<Player | undefined> = new BehaviorSubject<Player | undefined>(undefined);

  public gameStarted: boolean = false;

  constructor() {
    const storageState = localStorage.getItem('game');
    if (storageState) {
      try {
        const gameState = JSON.parse(storageState);
        this.playerOne.next(gameState.p1);
        this.playerTwo.next(gameState.p2);
        this.gameStarted = true;
      } catch (e) {
        console.error('Problem loading game state');
        localStorage.clear();
      }
    }

    combineLatest([this.playerOne, this.playerTwo]).subscribe(([p1, p2]) => {
      if (p1 && p2) {
        localStorage.setItem('game', JSON.stringify({ p1, p2 }));
      } else {
        localStorage.clear();
      }
    });
  }

  init(playerOneName: string, playerTwoName: string, playerTwoIsBot: boolean) {
    this.playerOne.next({
      name: playerOneName,
      lastMove: null,
      score: 0,
      isBot: false,
    });

    this.playerTwo.next({
      name: playerTwoName,
      lastMove: null,
      score: 0,
      isBot: playerTwoIsBot,
    });
  }

  reset() {
    this.gameStarted = false;
    this.playerOne.next(undefined);
    this.playerTwo.next(undefined);
  }

  playerOneMove(moveType: Move) {
    const p1 = this.playerOne.getValue();

    if (p1) p1.lastMove = moveType;
    this.playerOne.next(p1);

    if (this.playerTwo.getValue()?.isBot) {
      const moves = Object.values(Move);
      const i = Math.floor(Math.random() * moves.length);
      this.playerTwoMove(moves[i]);
    }
  }

  playerTwoMove(moveType: Move) {
    const p1 = this.playerOne.getValue();
    const p2 = this.playerTwo.getValue();

    if (p2) p2.lastMove = moveType;

    if (p1?.lastMove && p2?.lastMove) {
      const winner = this.winCheck(p1, p2);
      if (winner === p1) p1.score += 1;
      if (winner === p2) p2.score += 1;
    }

    this.playerTwo.next(p2);
  }

  playAgain() {
    const p1 = this.playerOne.getValue();
    const p2 = this.playerTwo.getValue();
    if (p1 && p2) {
      p1.lastMove = null;
      p2.lastMove = null;

      this.playerOne.next(p1);
      this.playerTwo.next(p2);
    }
  }

  private winCheck(p1: Player, p2: Player): Player | null {
    if (p1 && p2) {
      if (p1.lastMove === p2.lastMove) return null;

      if ([
        p1.lastMove,
        p2.lastMove,
      ].includes(Move.Rock) && [
        p1.lastMove,
        p2.lastMove,
      ].includes(Move.Scissors)) {
        if (p1.lastMove === Move.Rock) {
          return p1;
        } else {
          return p2;
        }
      } else if ([
        p1.lastMove,
        p2.lastMove,
      ].includes(Move.Scissors) && [
        p1.lastMove,
        p2.lastMove,
      ].includes(Move.Paper)) {
        if (p1.lastMove === Move.Scissors) {
          return p1;
        } else {
          return p2;
        }
      } else if ([
        p1.lastMove,
        p2.lastMove,
      ].includes(Move.Paper) && [
        p1.lastMove,
        p2.lastMove,
      ].includes(Move.Rock)) {
        if (p1.lastMove === Move.Paper) {
          return p1;
        } else {
          return p2;
        }
      }
    }

    return null;
  }
}
