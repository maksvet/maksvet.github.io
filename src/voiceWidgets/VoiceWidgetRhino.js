import { useEffect } from "react";
import { useRhino } from "@picovoice/rhino-react";

import rhinoModel from "../lib/rhino/rhinoModel";
import rhinoContext from "../lib/rhino/rhinoContext"
import CryptoJS from "crypto-js";
import { checkKey } from '../Setup.js'; // adjust the path as needed
const secretKey = process.env.REACT_APP_SECRET_KEY;
// Call checkKey function to ensure accessKey is set up in local storage
checkKey();

const encryptedKey = localStorage.getItem('accessKey');
let accessKey = '';
if (encryptedKey) {
    const bytes  = CryptoJS.AES.decrypt(encryptedKey, secretKey);
    accessKey = bytes.toString(CryptoJS.enc.Utf8);
}


//const accessKey = process.env.REACT_APP_ACCESS_KEY || "";
// const accessKey = localStorage.getItem('accessKey');
// const encryptedKey = localStorage.getItem('accessKey');
//     const bytes  = CryptoJS.AES.decrypt(encryptedKey, secretKey);
//     const accessKey = bytes.toString(CryptoJS.enc.Utf8);

export default function VoiceWidgetRhino({ initRhino, startListening, onCommandRecognized, onRelease }) {

  const {
    inference,
    contextInfo,
    isLoaded,
    isListening,
    error,
    init,
    process,
    release,
  } = useRhino();

  const rhnInit = async () => {
    await init(
      accessKey,
      rhinoContext,
      rhinoModel,
    );
    if (isLoaded) {
      await process()
    }
  }

  const rhnProcess = async () => {
    await process()
  }

  const rhnRelease = async () => {
    await release()
    onRelease()
  }

  useEffect(() => {
    if (initRhino) {
      rhnInit();
    }
    // eslint-disable-next-line
  }, [initRhino]); // Dependency array

  useEffect(() => {
    if (startListening && isLoaded) {
      // Start Rhino processing
      if (!isListening) {
        rhnProcess();
      } // This function should start the Rhino listening process
    }
    // eslint-disable-next-line
  }, [startListening, isLoaded]);

  useEffect(() => {
    if (inference) {
      onCommandRecognized(inference);
      release();
    }
    // eslint-disable-next-line
  }, [inference]);

  return (
    <div className="voice-widget">
      <h2>Commands detection</h2>
      <h3>
        <button className="start-button" onClick={() => rhnInit()} disabled={isLoaded}>
          Init Rhino
        </button>
      </h3>
      <h3>Rhino Loaded: {JSON.stringify(isLoaded)}</h3>
      <h3>Listening: {JSON.stringify(isListening)}</h3>
      <h3>Error: {JSON.stringify(error !== null)}</h3>

      <br />
      <button
        onClick={() => rhnProcess()}
        disabled={error !== null || !isLoaded || isListening}
      >
        Process
      </button>
      <button
        onClick={() => rhnRelease()}
        disabled={error !== null || !isLoaded || isListening}
      >
        Release
      </button>

      <h3>Inference:</h3>
      {inference && <pre>{JSON.stringify(inference, null, 2)}</pre>}
      <hr />
      <h3>Context Info:</h3>
      <pre>{contextInfo}</pre>
    </div>
  );
}
