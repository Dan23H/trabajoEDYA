import { useState } from 'react';
import './App.css';

export const App = () => {
  const [respuesta, setRespuesta] = useState('')
  const [cadena, setCadena] = useState(`2
  World Cup 1998 - Group A
  4
  Brazil
  Norway
  Morocco
  Scotland
  6
  Brazil#2@1#Scotland
  Norway#2@2#Morocco
  Scotland#1@1#Norway
  Brazil#3@0#Morocco
  Morocco#3@0#Scotland
  Brazil#1@2#Norway
  Some strange tournament
  5
  Team A
  Team B
  Team C
  Team D
  Team E
  5
  Team A#1@1#Team B
  Team A#2@2#Team C
  Team A#0@0#Team D
  Team E#2@1#Team C
  Team E#1@2#Team D`)

  const obtenerValores = (e) => {
    e.preventDefault()
    console.log(cadena)
    let txt = procesarCadena(cadena);
    setRespuesta(txt);
  }

  const handleText = (e) => {
    setCadena(e.target.value)
    console.log(cadena)
  }

  const clasificacionTorneo = (nombreTorneo, nombreEquipos, matches) => {
    const infoEquipos = new Map(
      nombreEquipos.map((nombreEquipo) => [
        nombreEquipo,
        {
          points: 0,
          gamesPlayed: 0,
          wins: 0,
          ties: 0,
          losses: 0,
          goalsScored: 0,
          goalsAgainst: 0,
          goalDifference: 0,
        },
      ])
    );

    matches.forEach((match) => {
      const [equipo1, resultado, equipo2] = match.split("#");
      const [goals1, goals2] = resultado.split("@").map(Number);
      infoEquipos.get(equipo1).gamesPlayed += 1;
      infoEquipos.get(equipo2).gamesPlayed += 1;
      infoEquipos.get(equipo1).goalsScored += goals1;
      infoEquipos.get(equipo2).goalsScored += goals2;
      infoEquipos.get(equipo1).goalsAgainst += goals2;
      infoEquipos.get(equipo2).goalsAgainst += goals1;
      if (goals1 > goals2) {
        infoEquipos.get(equipo1).points += 3;
        infoEquipos.get(equipo1).wins += 1;
        infoEquipos.get(equipo2).losses += 1;
      } else if (goals1 < goals2) {
        infoEquipos.get(equipo2).points += 3;
        infoEquipos.get(equipo2).wins += 1;
        infoEquipos.get(equipo1).losses += 1;
      } else {
        infoEquipos.get(equipo1).points += 1;
        infoEquipos.get(equipo2).points += 1;
        infoEquipos.get(equipo1).ties += 1;
        infoEquipos.get(equipo2).ties += 1;
      }
      infoEquipos.get(equipo1).goalDifference = infoEquipos.get(equipo1).goalsScored - infoEquipos.get(equipo1).goalsAgainst;
      infoEquipos.get(equipo2).goalDifference = infoEquipos.get(equipo2).goalsScored - infoEquipos.get(equipo2).goalsAgainst;
    });

    const sortedTeams = Array.from(infoEquipos.keys()).sort((a, b) => {
      if (infoEquipos.get(a).points !== infoEquipos.get(b).points) {
        return infoEquipos.get(b).points - infoEquipos.get(a).points;
      }
      if (infoEquipos.get(a).wins !== infoEquipos.get(b).wins) {
        return infoEquipos.get(b).wins - infoEquipos.get(a).wins;
      }
      if (infoEquipos.get(a).goalDifference !== infoEquipos.get(b).goalDifference) {
        return infoEquipos.get(b).goalDifference - infoEquipos.get(a).goalDifference;
      }
      if (infoEquipos.get(a).goalsScored !== infoEquipos.get(b).goalsScored) {
        return infoEquipos.get(b).goalsScored - infoEquipos.get(a).goalsScored;
      }
      if (infoEquipos.get(a).gamesPlayed !== infoEquipos.get(b).gamesPlayed) {
        return infoEquipos.get(a).gamesPlayed - infoEquipos.get(b).gamesPlayed;
      }
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    const standings = sortedTeams.map((team, index) => {
      const {
        points,
        gamesPlayed,
        wins,
        ties,
        losses,
        goalsScored,
        goalsAgainst,
        goalDifference,
      } = infoEquipos.get(team);
      return `${index + 1}) ${team} ${points}p, ${gamesPlayed}g (${wins}-${ties}-${losses}), ${goalDifference}gd (${goalsScored}-${goalsAgainst})`;
    });

    return `${nombreTorneo}\n${standings.join("\n")}\n`;
  }

  const procesarCadena = (entrada) => {
    const lineas = entrada.trim().split("\n");
    const n = Number(lineas.shift());
    let entrega = "";
    for (let i = 0; i < n; i++) {
      // read tournament name, team names, and matches
      const nombreTorneo = lineas.shift();
      const numeroEquipos = Number(lineas.shift());
      const nombreEquipos = [];
      for (let j = 0; j < numeroEquipos; j++) {
        nombreEquipos.push(lineas.shift());
      }
      const numeroMatches = Number(lineas.shift());
      const matches = [];
      for (let j = 0; j < numeroMatches; j++) {
        matches.push(lineas.shift());
      }
      // calculate tournament ranking and add to output string
      entrega += clasificacionTorneo(nombreTorneo, nombreEquipos, matches);
    }
    return entrega.trim();
  }

  return (
    <div className="App">

      <header class="titulos">
        <h1>Ingrese el torneo</h1>
      </header>
      <main class="principal">
        <form>
          <div class="entrada">
            <label for="cadena">Torneo:</label> <br />
            <input type="text" value={cadena} onChange={(event) => handleText(event)} />
            <button onClick={(event) => obtenerValores(event)}>Enviar</button>
          </div>
        </form>
        <div class="respuesta">
          <label for="respuesta">Respuesta:</label> <br />
          <textarea value={respuesta} rows="4" cols="50"></textarea>
        </div>

      </main>
    </div>
  );
}

export default App;
