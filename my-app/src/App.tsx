import * as React from "react";
import { PlayerManager, emitter } from "triton-lib";

function App() {
  const [playerType, setPlayerType] = React.useState<null | "triton" | "audio">(
    null
  );
  return (
    <div className="App">
      <h1>Playground app</h1>

      <button
        onClick={async () => {
          emitter.emit("play_triton_player", "VERONICA");
          setPlayerType("triton");
        }}
      >
        Play VERONICA (triton player)
      </button>
      <button
        onClick={async () => {
          emitter.emit("play_triton_player", "RADIO538");
          setPlayerType("triton");
        }}
      >
        Play RADIO538 (triton player)
      </button>

      <button
        style={{ border: "3px solid green" }}
        onClick={async () => {
          emitter.emit(
            "play_audio_player",
            "https://icecast-qmusicnl-cdp.triple-it.nl/Qmusic_nl_live.mp3?aw_0_1st.playerId=Juke"
          );
          setPlayerType("audio");
        }}
      >
        Play QMUSIC (Audio player)
      </button>

      <button
        onClick={async () => {
          emitter.emit("play_triton_player", "TLPNET01");
          setPlayerType("triton");
        }}
      >
        Play RADIO 10 (triton player)
      </button>

      <PlayerManager playerType={playerType} />
    </div>
  );
}

export default App;
