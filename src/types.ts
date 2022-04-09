export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export interface GuessResults {
  correct: number;
  incorrect: number;
}
