import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // async func has to rethrow error so its not resolved part of the promise. promise will now reject!! propogates the error down from one async function to another by rethrowing it
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPromise = fetch(url);
//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; // async func has to rethrow error so its not resolved part of the promise. promise will now reject!! propogates the error down from one async function to another by rethrowing it
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPromise = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err; // async func has to rethrow error so its not resolved part of the promise. promise will now reject!! propogates the error down from one async function to another by rethrowing it
//   }
// };
