import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {GameStateService} from "../../services/game-state.service";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {
  public startForm = new FormGroup({
    playerOneName: new FormControl(''),
    playerTwoName: new FormControl(''),
    playerTwoBot: new FormControl(false),
  })

  constructor(private gameStateService: GameStateService) { }

  ngOnInit(): void {
  }

  submit(): void {
    if (!this.startForm.invalid) {
      this.gameStateService.init(
        this.startForm.get('playerOneName')?.value || '',
        this.startForm.get('playerTwoName')?.value || '',
        this.startForm.get('playerTwoBot')?.value || false,
      );
    }
  }
}
