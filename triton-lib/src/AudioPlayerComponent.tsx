import * as React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { emitter } from './shared';
import { WithPlayerType } from './types';

export const AudioPlayerComponent: React.FC<WithPlayerType> = ({}) => {
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

  React.useEffect(() => {
    const playerNode = getPlayerNode();
    if (streamUrl && playerNode) {
      playerNode.src = playerNode.src;
      playerNode.load();
      const playPromise = playerNode.play();
      console.log('@@start play', streamUrl);

      window.Promise.resolve(playPromise).catch(error => {
        console.log('@error when playing audio', error);
      });
    }
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
