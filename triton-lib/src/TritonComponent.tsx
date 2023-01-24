//@ts-nocheck

import * as React from 'react';

import { emitter } from './shared';

import loadScript from 'load-script';
import { WithPlayerType } from './types';

function getGlobal(key) {
  if (window[key]) {
    return window[key];
  }
  if (window.exports && window.exports[key]) {
    return window.exports[key];
  }
  if (window.module && window.module.exports && window.module.exports[key]) {
    return window.module.exports[key];
  }
  return null;
}

const requests = {};
export function loadSDK(
  url,
  sdkGlobal,
  sdkReady = null,
  isLoaded = () => true,
  fetchScript = loadScript
) {
  const existingGlobal = getGlobal(sdkGlobal);
  if (existingGlobal && isLoaded(existingGlobal)) {
    return Promise.resolve(existingGlobal);
  }
  return new Promise((resolve, reject) => {
    if (requests[url]) {
      requests[url].push({ resolve, reject });
      return;
    }
    requests[url] = [{ resolve, reject }];
    const onLoaded = sdk => {
      requests[url].forEach(request => request.resolve(sdk));
    };
    if (sdkReady) {
      const previousOnReady = window[sdkReady];
      window[sdkReady] = () => {
        if (previousOnReady) previousOnReady();
        onLoaded(getGlobal(sdkGlobal));
      };
    }
    fetchScript(url, err => {
      if (err) {
        requests[url].forEach(request => request.reject(err));
        requests[url] = null;
      } else if (!sdkReady) {
        onLoaded(getGlobal(sdkGlobal));
      }
    });
  });
}

const playerId = 'td_container'; // Triton Player Id

const SDK_URL = 'https://sdk.listenlive.co/web/2.9/td-sdk.min.js';
const SDK_GLOBAL = 'TDSdk';

const config = { streamUrl: 'VERONICA' };

export const TritonComponent: React.FC<WithPlayerType> = ({ playerType }) => {
  const playerRef = React.useRef(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    emitter.on('play_triton_player', loadAndPlay);
    return () => {
      emitter.off('play_triton_player', loadAndPlay);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (playerType !== 'triton') {
        playerRef.current?.stop();
        playerRef.current?.destroy();
        playerRef.current = null;
      }
    };
  }, [playerType]);

  const onPlayerReady = resolve => {
    setIsReady(true);
    return resolve();
  };
  /**
   * Creates a new instance of Triton SDK configured with a settings object
   */
  const configureTriton = async (TDSdk, resolve) => {
    // Triton Digital player configuration
    const tritonConfig = {
      coreModules: [],
      playerReady: () => {},
      configurationError: () => {},
      adBlockerDetected: () => {},
      moduleError: () => {},
    };

    const urlSearchParams = new URLSearchParams(window.location.search);

    const age = urlSearchParams.get('age') || '';
    const dob = urlSearchParams.get('dob') || '';
    const yob = urlSearchParams.get('yob') || '';
    const gender = urlSearchParams.get('gender') || '';
    const ip = urlSearchParams.get('ip') || '';
    const idSyncStation =
      urlSearchParams.get('idSyncStation') || config.streamUrl;

    // MediaPlayer module
    const mediaPlayerModule = {
      id: 'MediaPlayer',
      playerId,
      techPriority: ['Html5'],
      isDebug: false,
      playerServicesRegion: 'eu',
      geoTargeting: false,
      sbm: {
        active: true,
        aSyncCuePointFallback: true,
      },
      idSync: {
        station: idSyncStation,
        age,
        dob,
        yob,
        gender,
        ip,
      },
    };

    if (config?.gdpr) {
      mediaPlayerModule.idSync.gdpr = config.gdpr;
    }

    if (config?.gdprConsent) {
      mediaPlayerModule.idSync.gdpr_consent = config.gdprConsent;
    }

    // Add the MediaPlayer module
    tritonConfig.coreModules.push(mediaPlayerModule);

    // Setup configuration listeners
    tritonConfig.playerReady = () => onPlayerReady(resolve);

    // Instantiate the Triton Digital Player
    const player = new TDSdk(tritonConfig);

    if (playerRef) {
      playerRef.current = player;
    }
    window.player = player;
  };

  const load = async () => {
    return loadSDK(SDK_URL, SDK_GLOBAL).then(Triton => {
      setIsReady(false);
      if (playerRef?.current) {
        playerRef?.current.destroy();
        playerRef.current = null;
      }
      return new Promise(res => {
        setTimeout(() => {
          configureTriton(Triton, res);
        }, 500);
      });
    });
  };

  async function loadAndPlay(station: string) {
    playerRef.current?.stop();
    config.streamUrl = station;
    await load();
    playerRef.current?.play({ mount: station });
  }

  return <div className="my-triton-app"></div>;
};
