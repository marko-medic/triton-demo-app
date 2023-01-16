import * as React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { emitter } from './shared';
import { WithPlayerType } from './types';

export const AudioPlayerComponent: React.FC<WithPlayerType> = ({
  playerType,
}) => {
  const playerRef = React.useRef<ReactAudioPlayer>(null);
  const [streamUrl, setStreamUrl] = React.useState('');

  const getPlayerNode = () => {
    return playerRef?.current?.audioEl?.current;
  };

  React.useEffect(() => {
    emitter.on('play_audio_player', setStreamUrl);

    return () => {
      emitter.off('play_audio_player', setStreamUrl);
    };
  }, []);

  const handleStop = () => {
    const audio = getPlayerNode();
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    // eslint-disable-next-line no-self-assign
    audio.src = audio.src;
    setStreamUrl('');
  };

  const handlePlay = (url: string) => {
    handleStop();
    setStreamUrl(url);

    const audio = getPlayerNode();
    if (!audio) {
      return;
    }
    // eslint-disable-next-line no-self-assign
    audio.src = streamUrl;
    audio.load();
    console.log('@@Play', url);

    const playPromise = audio.play();
    window.Promise.resolve(playPromise);
  };

  React.useEffect(() => {
    if (playerType !== 'audio') {
      handleStop();
    }
  }, [playerType]);

  React.useEffect(() => {
    if (!streamUrl) {
      return;
    }
    handlePlay(streamUrl);
  }, [streamUrl]);

  return (
    <ReactAudioPlayer
      listenInterval={1000}
      id="audio-player"
      muted={false}
      ref={playerRef}
      src={streamUrl}
      volume={1}
    />
  );
};
