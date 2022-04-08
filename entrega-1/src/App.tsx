import {useEffect, useRef, useState} from "react";

import api from "./api";
import {Pokemon} from "./types";

function App() {
  const pokemonInput = useRef<HTMLInputElement>(null);
  const pokemonImage = useRef<HTMLImageElement>(null);
  const [pokemonGuess, setPokemonGuess] = useState<Pokemon>();
  const [pokemonIsDiscovered, setPokemonIsDiscovered] = useState<boolean>(false);
  const [inputWithError, setInputWithError] = useState<boolean>(false);

  useEffect(() => {
    // set random pokemon guess
    api.random().then(setPokemonGuess);
  }, []);

  const testUserGuess = () => {
    const $pokemonInput = pokemonInput.current!;

    // Display input error if user doesn't entered any text
    if (!$pokemonInput.value.length) {
      setInputWithError(true);

      return;
    }

    // Discover pokemon image
    $pokemonInput.value = "";
    setPokemonIsDiscovered(true);
  };

  const handleInputChange = () => {
    setInputWithError(false);
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <img alt="Pokeball" className="nes-avatar is-medium" src="/assets/images/pokeball.png" />
        <span className="ml-1">Pokemon Guess Challenge</span>
      </header>

      {/* Main section */}
      <main>
        <h1 className="main-title">Quién es este Pokemon?</h1>

        <img
          ref={pokemonImage}
          alt={`Imagen del pokemon ${pokemonGuess?.name}`}
          className={`${pokemonIsDiscovered ? "" : "no-brightness"}`}
          src={pokemonGuess?.image}
        />

        <h3>{pokemonIsDiscovered ? pokemonGuess?.name : ""}</h3>

        <section className="form-wrapper">
          <div className="nes-field is-inline form-container">
            <div className="input-container">
              <input
                ref={pokemonInput}
                required
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

            <button className="nes-btn is-primary" type="button" onClick={testUserGuess}>
              Adivinar
            </button>
          </div>
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
    </>
  );
}

export default App;
