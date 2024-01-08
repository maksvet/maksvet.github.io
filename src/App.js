import React, { useState, useEffect, memo } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import CountdownTimer from './components/countdown.js';
import VoiceWidget from './voiceWidgets/VoiceWidget.js';
import VoiceWidgetRhino from './voiceWidgets/VoiceWidgetRhino.js';

const VoiceWidgetRhinoMemo = memo(VoiceWidgetRhino);

const App = () => {
  console.log('Rendering App component');

  const [N0, setN0] = useState(0);
  const [N1, setN1] = useState(0);
  const [isPlayerLanded, setIsPlayerLanded] = useState(false);
  const [isOpponentLanded, setIsOpponentLanded] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(240); // Total match time in seconds
  const [playerAirtime, setPlayerAirtime] = useState(0);
  const [opponentAirtime, setOpponentAirtime] = useState(0);

  // Porcupine code
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [isCommandRecognized, setIsCommandRecognized] = useState(false);


  const onWakeWordDetected = () => {
    console.log('Wake word detected');
    unstable_batchedUpdates(() => {
      setWakeWordDetected(true);
      setIsListeningForCommand(true);
      setIsCommandRecognized(false);
    });
  };

  useEffect(() => {
    if (wakeWordDetected) {
      setIsListeningForCommand(true);
    }
  }, [wakeWordDetected]);



  // Rhino code
  const [initRhino, setInitRhino] = useState(false);
  const [isListeningForCommand, setIsListeningForCommand] = useState(false);
  const onCommandRecognized = (inference) => {
    console.log(inference);
    if (inference.isUnderstood) {
      const { intent, slots } = inference;
      console.log(`Intent recognized: ${intent}`);
      // Logic to handle different intents
      if (intent === 'Start') {
        setStartCountdown(true);
      }
      else {
        console.log('Intent not recognized');
      }

    };
    setInitRhino(false); // check if release could be used instead
    setIsCommandRecognized(true);
  };
  useEffect(() => {
    if (wakeWordDetected) {
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

  const playerPoints = playerAirtime + 50 * N0;
  const opponentPoints = opponentAirtime + 50 * N1;

  return (
    <div>
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
        <CountdownTimer
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
        <VoiceWidget onWakeWordDetected={onWakeWordDetected} isCommandRecognized={isCommandRecognized} />
      </div>

      {isListeningForCommand && (
        <VoiceWidgetRhinoMemo initRhino={initRhino} startListening={isListeningForCommand} onCommandRecognized={onCommandRecognized} />
      )}
    </div>
  );
};

export default App;
