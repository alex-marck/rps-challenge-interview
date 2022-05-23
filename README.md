# Rock, Paper, Scissors Multiplayer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.6.

## Initial Thoughts

When the requirements state that there is a multiplayer element to the game, I imagine multiple different modes of multiplayer that can satisfy the requirements:

1. A local multiplayer, where two players play on the same machine. The first player takes their turn to select their move (assuming the other player is looking away), and then the other player takes their turn at the computer and selects their move. After the second player makes their selection, the winner of the round is revealed. Game state can be persisted via localStorage.
2. An online multiplayer, where two players each play on their own machine. Both players select their moves asynchronously, and the winner for a round is announced after both players have selected their move. Game state is stored in a remote database, and may require account signup. Alternatively, in lieu of account signup, some sort of room URL can be created; a player makes a room, receive room URL that they can share, and then a second player can join the game at that URL.
3. A hybrid approach; the multiplayer itself is done locally, but the state of wins/losses etc. is recorded in a remote database.

I decided to keep myself strictly within 3 hours. I initially tried approach #2, but realized after 30 minutes that I'd be spending a substantial amount of my time configuring authorization code on the backend and session management on the frontend instead of working toward the requirements, so I shifted to approach #1. 

## Approach

My main approach was to generate two components, `start-page` and `match-page`. I also created a `game-state` service to track the state of matches.

- `start-page` will be the landing page for the user. It will prompt the user(s) to enter their player names, and will allow an option for selecting whether player 2 should a bot.
- `match-page` will be where both players select rock, paper, or scissors. It will display each player's score.
- `game-state` will track player score, and will expose functions like `playerOneMove(move: Move)` to advance the game state

The app state will be contained within a `Player` interface for each player. I created a `BehaviorSubject` for each within the `game-state` service.

```typescript
interface Player {
  name: string | null;
  lastMove: Move | null; // Move being rock, papper, scissors enum. null if no move selected
  score: number;
  isBot: boolean;
}
```

Whenever player state is updated, I save both player's states to localStorage. When `game-state` is initialized, I check localStorage for player objects.
If they exist, I pass through their new state, allowing the game to automatically load in new game states.

`match-page` component tracks player changes and then renders any appropriate data to the template. From here, players can also make their game moves (select rock, paper, or scissors).
I realize a potential problem with my strategy; `game-state` will increment the player scores if a player ones, but I don't know which player won.
Instead of tracking the last winning player within `game-state`, my initial idea, I realized that this information can be inferred from player state changes. 
I use a combination of rxjs `map` and `pairwise` to track previous player scores, which can then be compared to current player scores.
If the score has incremented up for a player, then they've won, and I can display a win message.

I then dropped in bot functionality; if the second player is a bot, then their move will be automatically picked after player one makes a move. I had some extra time left, so I added some styling to my game as well.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
