import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function SpeechRec({ onCommand }) {
    const commands = [
        {
            command: 'старт',
            callback: () => onCommand('старт'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        {
            command: 'взлетел',
            callback: () => onCommand('взлетел'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        {
            command: 'сел',
            callback: () => onCommand('сел'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        {
            command: 'отруб',
            callback: () => onCommand('отруб'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        // ...add more commands as needed
    ];

    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

    // Auto-start speech recognition when the component mounts
    useEffect(() => {
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.startListening({ continuous: true, language: 'ru' });
        }

        // Optional: stop listening when the component unmounts
        return () => {
            SpeechRecognition.stopListening();
        };
    }, [browserSupportsSpeechRecognition]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const stopListening = () => SpeechRecognition.stopListening();

    return (
        <div className="container d-flex">
            <p className="p-2 m-2">
                {transcript}
            </p>
            <button
                onClick={stopListening}
                className="btn btn-danger">Stop Listening</button>
        </div>
    );
}
