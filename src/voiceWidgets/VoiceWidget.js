import React, { useEffect, useState, useCallback } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
import porcupineModel from "../lib/porcupine/porcupineModel";
import porcupineKeywords from "../lib/porcupine/porcupineKeywords";


export default function VoiceWidget({ onWakeWordDetected, restartCondition, setRestartCondition }) {
    const [keywordDetections, setKeywordDetections] = useState([]);
    //const [isWakeWordDetected, setIsWakeWordDetected] = useState(false); // New state to track if wake word is detected
    const accessKey = process.env.REACT_APP_ACCESS_KEY || "";

    const {
        keywordDetection,
        isLoaded,
        isListening,
        error,
        init,
        start,
        stop,
        release
    } = usePorcupine();

    const initEngine = useCallback(async () => {
        await init(accessKey, porcupineKeywords, porcupineModel);
    // eslint-disable-next-line
    }, [init, porcupineKeywords, accessKey]);

    useEffect(() => {
        initEngine();
    }, [initEngine]);

    
    useEffect(() => {
        if (keywordDetection !== null) {
            setKeywordDetections((oldVal) => [...oldVal, keywordDetection.label]);

            // Stop the engine when a keyword is detected
            console.log("Stop the engine when a keyword is detected")
            stop();
            onWakeWordDetected();

            // Log a message to the console
            console.log('Wake word detected, stopping for a second...');
        }
        // eslint-disable-next-line
    }, [keywordDetection, stop]);

    // Handle restart condition
    useEffect(() => {
        if (restartCondition) {
            // Log a message to the console
            console.log('Restart condition met, restarting...');

            // Stop and restart the engine
            stop();
            start();

            setRestartCondition(false);
        }
        // eslint-disable-next-line
    }, [restartCondition, stop, start]);

    return (
        <div className="voice-widget">
            <h2>Wake word</h2>
            <h3>
                <label>
                    <button className="init-button" onClick={() => initEngine()}>
                        Init Porcupine
                    </button>
                </label>
            </h3>
            <h3>Loaded: {JSON.stringify(isLoaded)}</h3>
            <h3>Listening: {JSON.stringify(isListening)}</h3>
            <h3>Error: {JSON.stringify(error !== null)}</h3>
            {error && <p className="error-message">{error.toString()}</p>}
            <br />
            <button onClick={() => start()} disabled={error !== null || !isLoaded || isListening}>
                Start
            </button>
            <button onClick={() => stop()} disabled={error !== null || !isLoaded || !isListening}>
                Stop
            </button>
            <button onClick={() => release()} disabled={error !== null || !isLoaded}>
                Release
            </button>
            <h3>Keyword Detections:</h3>
            {keywordDetections.length > 0 && (
                <ul>
                    {keywordDetections.map((label, index) => (
                        <li key={index}>{label}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
