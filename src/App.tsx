import {useEffect, useRef, useState} from "react";

import api from "./api";
import useLocalStorage from "./hooks/useLocalStorage";
import {GuessResults, Pokemon} from "./types";

const initialValue: GuessResults = {
  correct: 0,
  incorrect: 0,
};

function App() {
  const pokemonInput = useRef<HTMLInputElement>(null);
  const pokemonImage = useRef<HTMLImageElement>(null);

  const [guessResults, setGuessResults] = useLocalStorage("guess-results", initialValue);

  const [pokemonGuess, setPokemonGuess] = useState<Pokemon>();
  const [userGuessedOk, setUserGuessedOk] = useState<boolean | null>(null);
  const [pokemonIsDiscovered, setPokemonIsDiscovered] = useState<boolean>(false);
  const [inputWithError, setInputWithError] = useState<boolean>(false);

  useEffect(() => {
    // set random pokemon guess
    api.random().then(setPokemonGuess);

    // set input focus
    pokemonInput.current?.focus();
  }, []);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
  };

  const testUserGuess = () => {
    const $pokemonInput = pokemonInput.current!;

    // Display input error if user doesn't entered any text
    if (!$pokemonInput.value.length) {
      setInputWithError(true);

      return;
    }

    // Discover pokemon image
    setPokemonIsDiscovered(true);

    // set guess result
    const guessResult =
      $pokemonInput.value.replace(/[^a-zA-Z]/g, "").toLowerCase() === pokemonGuess?.name;

    setGuessResults((prevValue) => ({
      correct: guessResult === true ? prevValue.correct + 1 : prevValue.correct,
      incorrect: guessResult === false ? prevValue.incorrect + 1 : prevValue.incorrect,
    }));

    setUserGuessedOk(guessResult);
    $pokemonInput.value = "";
  };

  const handleInputChange = () => {
    setInputWithError(false);
  };

  const resetGame = () => {
    // reset input focus
    pokemonInput.current?.focus();

    // reset random pokemon guess
    api.random().then(setPokemonGuess);

    setUserGuessedOk(null);
    setPokemonIsDiscovered(false);
    setInputWithError(false);
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <img alt="Pokeball" className="nes-avatar is-medium" src="/assets/images/pokeball.png" />
        <span className="ml-1">Pokemon Guess Challenge</span>
      </header>

      {/* Main section */}
      <main>
        <section className="nes-container is-rounded mb-2 results-container">
          <p className="nes-text is-success d-flex align-center justify-between">
            <span>
              <i className="nes-icon is-small check" />
              <span className="ml-1">Aciertos:</span>
            </span>
            <span>{guessResults.correct}</span>
          </p>

          <p className="nes-text is-error d-flex align-center justify-between">
            <span>
              <i className="nes-icon is-small times" />
              <span className="ml-1">Errores:</span>
            </span>
            <span>{guessResults.incorrect}</span>
          </p>
        </section>

        <h1 className="main-title">Quién es este Pokemon?</h1>

        <img
          ref={pokemonImage}
          alt={`Imagen del pokemon ${pokemonGuess?.name}`}
          className={`${pokemonIsDiscovered ? "" : "no-brightness"}`}
          src={pokemonGuess?.image}
        />

        <h3 className="pokemon-name">{pokemonIsDiscovered ? pokemonGuess?.name : ""}</h3>

        <section className="my-1 text-center guess-result--container">
          {userGuessedOk === null ? (
            <>{"Aquí se verá el resultado de la adivinanza"}</>
          ) : userGuessedOk === true ? (
            <span className="nes-text is-success">
              <i className="nes-icon is-small check" />
              <span className="ml-1">Exito.. Adivinaste!</span>
            </span>
          ) : (
            <span className="nes-text is-error">
              <i className="nes-icon is-small times" />
              <span className="ml-1">Erraste.. Sigue intentando</span>
            </span>
          )}
        </section>

        <section className="form-wrapper">
          <form className="nes-field is-inline form-container" onSubmit={handleOnSubmit}>
            {pokemonIsDiscovered === false ? (
              <div className="input-container">
                <input
                  ref={pokemonInput}
                  className={`nes-input input ${inputWithError ? "is-error" : ""}`}
                  id="inline_field"
                  placeholder="Ingresa el pokemon..."
                  type="text"
                  onChange={handleInputChange}
                />
                {inputWithError ? (
                  <span className="nes-text is-error input-error">Debes ingresar un valor</span>
                ) : (
                  ""
                )}
              </div>
            ) : null}

            {pokemonIsDiscovered ? (
              <button className="nes-btn is-error" type="button" onClick={resetGame}>
                Volver a jugar
              </button>
            ) : (
              <button className="nes-btn is-primary" type="submit" onClick={testUserGuess}>
                Adivinar
              </button>
            )}
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>
          Challenge made by Ivan Guerra. Based in{" "}
          <a href="https://twitter.com/goncy" rel="noreferrer" target="_blank">
            @goncy
          </a>
          &apos;s{" "}
          <a
            href="https://github.com/goncy/interview-challenges/tree/main/guess-pokemon"
            rel="noreferrer"
            target="_blank"
          >
            challenge
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
