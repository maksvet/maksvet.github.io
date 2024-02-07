import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// if ('serviceWorker' in navigator) {
//   // Register a service worker hosted at the root of the
//   // site using the default scope.
//   navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`).then(
//     registration => {
//       console.log('Service worker registration succeeded:', registration);
//     },
//     /*catch*/ error => {
//       console.error(`Service worker registration failed: ${error}`);
//     }
//   );
// } else {
//   console.error('Service workers are not supported.');
// }

serviceWorkerRegistration.register();
