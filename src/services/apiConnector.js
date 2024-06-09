export const apiConnector = (method, url, bodyData, headers, params) => {
  // Construct options object for fetch
  const options = {
    method: method.toUpperCase(),
    headers: headers || {},
    body: bodyData ? JSON.stringify(bodyData) : undefined,
  };

  // Append query parameters to URL if present
  const queryString = params ? `?${new URLSearchParams(params)}` : '';
  const requestUrl = `${url}${queryString}`;

  // Make fetch request
  return fetch(requestUrl, options)
    .then(response => {
      // Check if response is OK (status 2xx)
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      // Parse JSON response
      return response.json();
    })
    .catch(error => {
      // Handle network errors or failed requests
      throw new Error(`Network Error: ${error.message}`);
    });
};
