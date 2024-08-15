import { log } from './log';

export const apiConnector = (method, url, bodyData, headers = {}, params = {}) => {
  // Ensure Content-Type header is set if not provided
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  // Construct options object for fetch
  const options = {
    method: method.toUpperCase(),
    headers: headers,
    body: bodyData ? JSON.stringify(bodyData) : undefined,
  };
  
  // Append query parameters to URL if present
  const queryString = params ? `?${new URLSearchParams(params)}` : '';
  const requestUrl = `${url}${queryString}`;

  log("Request URL and Options:", requestUrl, options);

  // Make fetch request
  return fetch(requestUrl, options)
    .then(response => {
      // Check if response is OK (status 2xx)
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      // Handle network errors or failed requests
      throw new Error(`Network Error: ${error.message}`);
    });
};
