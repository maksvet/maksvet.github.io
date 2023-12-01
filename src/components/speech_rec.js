// import React from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// export default function SpeechRec() {
//     const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ru' });
//     const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
//     return (
//         <div className="container d-flex">
//             <p className="p-2 m-2">
//                 {transcript}
//             </p>
//             <button
//                 onClick={startListening}
//                 className="btn btn-success">Start Listening</button>
//             <button onClick={stopListening} className="btn btn-danger">Stop Listening</button>
//         </div>
//     );
// }


import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function SpeechRec({ onCommand }) {
    const commands = [
        {
            command: 'start countdown',
            callback: () => onCommand('start_countdown'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        {
            command: 'stop countdown',
            callback: () => onCommand('stop_countdown'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        {
            command: 'land player',
            callback: () => onCommand('land_player'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        {
            command: 'take off player',
            callback: () => onCommand('take_off_player'),
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7
        },
        // ...add more commands as needed
    ];

    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'ru' });
    const stopListening = () => SpeechRecognition.stopListening();

    return (
        <div className="container d-flex">
            <p className="p-2 m-2">
                {transcript}
            </p>
            <button
                onClick={startListening}
                className="btn btn-success">Start Listening</button>
            <button
                onClick={stopListening}
                className="btn btn-danger">Stop Listening</button>
        </div>
    );
}
