import React, { useState, useEffect, memo } from 'react';
import CountdownTimer from './components/countdown.js';
import VoiceWidget from './voiceWidgets/VoiceWidget.js';
import VoiceWidgetRhino from './voiceWidgets/VoiceWidgetRhino.js';
import { audioFiles } from './components/audio_assets.js';
import { Setup, checkKey, resetKey } from './Setup';

const VoiceWidgetRhinoMemo = memo(VoiceWidgetRhino);
const CountdownTimerMemo = memo(CountdownTimer);

const App = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(checkKey());
  const [N0, setN0] = useState(0);
  const [N1, setN1] = useState(0);
  const [isPlayerLanded, setIsPlayerLanded] = useState(false);
  const [isOpponentLanded, setIsOpponentLanded] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(240); // Total match time in seconds
  const [playerAirtime, setPlayerAirtime] = useState(0);
  const [opponentAirtime, setOpponentAirtime] = useState(0);

  //testing the sounds
  const [userConsent, setUserConsent] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);


  useEffect(() => {
    const audioArray = Object.values(audioFiles); // convert object values to an array
    const interval = setInterval(() => {
      if (userConsent) {
        console.log('userConsent:', userConsent); // Log userConsent
        console.log('currentAudioIndex:', currentAudioIndex); // Log currentAudioIndex
        new Audio(audioArray[currentAudioIndex]).play();
        setCurrentAudioIndex((currentAudioIndex + 1) % audioArray.length);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userConsent, currentAudioIndex]);

  // Porcupine code
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [restartCondition, setRestartCondition] = useState(false);

  const onWakeWordDetected = () => {
    console.log('Wake word detected');
    new Audio(audioFiles.leopoldListens).play();

    setWakeWordDetected(true);

  };

  useEffect(() => {
    if (wakeWordDetected) {
      setIsListeningForCommand(true);
    }
  }, [wakeWordDetected]);

  // Rhino code
  const rhnRelease = () => {
    setWakeWordDetected(false); // Reset wakeWordDetected
    setInitRhino(false); // Reset initRhino
  };
  const [initRhino, setInitRhino] = useState(false);
  const [isListeningForCommand, setIsListeningForCommand] = useState(false);
  const onCommandRecognized = (inference) => {
    console.log(inference);
    if (inference.isUnderstood) {
      const { intent, slots } = inference;
      // ignore lint
      console.log(`Intent recognized: ${intent}`);
      // Logic to handle different intents
      if (intent === 'Start') {
        new Audio(audioFiles.start).play();
        console.log('Start command recognized');
        setStartCountdown(true);
      }
      if (intent === 'Stop') {
        new Audio(audioFiles.stop).play();
        console.log('Stop command recognized');
        setStartCountdown(false);
      }
      if (intent === 'I_landed') {
        new Audio(audioFiles.i_landed).play();
        console.log('I_landed command recognized');
        setIsPlayerLanded(true);
      }
      if (intent === 'I_am_up') {
        new Audio(audioFiles.im_up).play();
        console.log('I_am_up command recognized');
        setIsPlayerLanded(false);
      }
      if (intent === 'Opponent_landed') {
        new Audio(audioFiles.opponent_landed).play();
        console.log('Opponent_landed command recognized');
        setIsOpponentLanded(true);
      }
      if (intent === 'Opponent_is_up') {
        new Audio(audioFiles.opponent_up).play();
        console.log('Opponent_is_up command recognized');
        setIsOpponentLanded(false);
      }
      if (intent === 'I_made_cut') {
        new Audio(audioFiles.plus_one).play();
        console.log('I_made_cut command recognized');
        setN0(N0 + 1);
      }
      if (intent === 'Opponent_made_cut') {
        new Audio(audioFiles.minus_one).play();
        console.log('Opponent_made_cut command recognized');
        setN1(N1 + 1);
      }

      setRestartCondition(true);
      setIsListeningForCommand(false);

    } else {
      new Audio(audioFiles.didntUnderstand).play();
      console.log('Command not recognized');
      setIsListeningForCommand(false);
      setRestartCondition(true);
    }
    rhnRelease();

  };
  useEffect(() => {
    if (wakeWordDetected) {
      console.log("setting initRhino to true");
      setInitRhino(true);
    }
  }, [wakeWordDetected]);

  const handleTacticalLanding = () => {
    console.log("Tactical Landing Time reached!");
  };

  useEffect(() => {
    if (startCountdown) {
      const updateAirtime = () => {

        if (!isPlayerLanded) {
          setPlayerAirtime(playerAirtime + 1);
        }
        if (!isOpponentLanded) {
          setOpponentAirtime(opponentAirtime + 1);
        }
      };

      const timer = setTimeout(updateAirtime, 1000);
      return () => clearTimeout(timer);
    }
  }, [playerAirtime, opponentAirtime, isPlayerLanded, isOpponentLanded, startCountdown]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setStartCountdown(false);
    }
  }, [timeLeft]);

  const playerPoints = playerAirtime + 50 * N0;
  const opponentPoints = opponentAirtime + 50 * N1;
  
  // Setup code
  useEffect(() => {
    if (!isSetupComplete) {
      // Prompt the user for a key
    }
  }, [isSetupComplete]);

  if (!isSetupComplete) {
    return <Setup onKeySubmit={() => setIsSetupComplete(true)} />;
  }
  const handleReset = () => {
    resetKey();
    setIsSetupComplete(false);
  };

  return (
    <div>
      <button onClick={() => setUserConsent(true)}>Give Consent</button>
      <input type="number" placeholder="N0 (My Cuts)" value={N0} onChange={(e) => setN0(parseInt(e.target.value, 10))} />
      <button onClick={() => setIsPlayerLanded(!isPlayerLanded)}>
        {isPlayerLanded ? "Take Off" : "Land"}
      </button>
      <div>My Points: {playerPoints}</div>

      <input type="number" placeholder="N1 (Opponent Cuts)" value={N1} onChange={(e) => setN1(parseInt(e.target.value, 10))} />
      <button onClick={() => setIsOpponentLanded(!isOpponentLanded)}>
        {isOpponentLanded ? "Take Off" : "Land"}
      </button>
      <div>Opponent Points: {opponentPoints}</div>

      <button onClick={() => setStartCountdown(true)}>Start Countdown</button>
      {startCountdown && (
        <CountdownTimerMemo
          N0={N0}
          N1={N1}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTacticalLanding={handleTacticalLanding}
          isPlayerLanded={isPlayerLanded}
          isOpponentLanded={isOpponentLanded}
        />
      )}

      <div className="App">
        <VoiceWidget onWakeWordDetected={onWakeWordDetected} restartCondition={restartCondition} setRestartCondition={setRestartCondition} />
      </div>

      {isListeningForCommand && (
        /* eslint-disable-next-line jsx-a11y/no-access-key */
        <VoiceWidgetRhinoMemo initRhino={initRhino} startListening={isListeningForCommand} onCommandRecognized={onCommandRecognized} onRelease={rhnRelease} />
      )}
      <button onClick={handleReset}>Reset Key</button>
    </div>
  );
};

export default App;
