import { useState } from "react";
import { useRhino } from "@picovoice/rhino-react";

import rhinoModel from "../lib/rhino/rhinoModel";
import rhinoContext from "../lib/rhino/rhinoContext"

const accessKey = process.env.REACT_APP_ACCESS_KEY || "";

export default function VoiceWidgetRhino() {

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
  }

  const rhnProcess = async () => {
    await process()
  }

  const rhnRelease = async () => {
    await release()
  }

  return (
    <div className="voice-widget">
      <h2>VoiceWidget</h2>
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
