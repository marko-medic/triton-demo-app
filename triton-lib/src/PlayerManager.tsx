import * as React from 'react';
import { AudioPlayerComponent } from './AudioPlayerComponent';
import { TritonComponent } from './TritonComponent';
import { WithPlayerType } from './types';

export const PlayerManager: React.FC<WithPlayerType> = ({ playerType }) => {
  return (
    <div>
      <AudioPlayerComponent playerType={playerType} />
      <TritonComponent playerType={playerType} />
    </div>
  );
};
