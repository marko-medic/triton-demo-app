import * as React from "react";
import { PlayerManager, emitter } from "triton-lib";

function App() {
  const [playerType, setPlayerType] = React.useState<null | "triton" | "audio">(
    null
  );
  const [streamingUrl, setStreamingUrl] = React.useState("");
  return (
    <div className="App">
      <h1>Playground app</h1>

      <button
        onClick={async () => {
          const url = "VERONICA";
          setPlayerType("triton");
          emitter.emit("play_triton_player", url);
          setStreamingUrl(url);
        }}
      >
        Play VERONICA (triton player)
      </button>
      <button
        onClick={async () => {
          const url = "RADIO538";
          setPlayerType("triton");
          emitter.emit("play_triton_player", url);
          setStreamingUrl(url);
        }}
      >
        Play RADIO538 (triton player)
      </button>

      <button
        style={{ border: "3px solid green" }}
        onClick={async () => {
          setPlayerType("audio");
          const url =
            "https://icecast-qmusicnl-cdp.triple-it.nl/Qmusic_nl_live.mp3?aw_0_1st.playerId=Juke";
          emitter.emit("play_audio_player", url);
          setStreamingUrl(url);
        }}
      >
        Play QMUSIC (Audio player)
      </button>

      <button
        onClick={async () => {
          const url = "TLPNET01";
          emitter.emit("play_triton_player", url);
          setPlayerType("triton");
          setStreamingUrl(url);
        }}
      >
        Play RADIO 10 (triton player)
      </button>

      <PlayerManager playerType={playerType} />
      <p>
        Playing... {playerType || "nothing"} url: {streamingUrl || "no URL"}
      </p>
    </div>
  );
}

export default App;
