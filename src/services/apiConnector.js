import { log } from './log';

export const apiConnector = async (method, url, bodyData, headers = {}, params = {}) => {
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';

  const options = {
    method: method.toUpperCase(),
    headers: headers,
    body: bodyData ? JSON.stringify(bodyData) : undefined,
  };
  
  const queryString = params ? `?${new URLSearchParams(params)}` : '';
  const requestUrl = `${url}${queryString}`;

  log("Request URL and Options:", requestUrl, options);

  try {
    const response = await fetch(requestUrl, options);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Unexpected content-type: ${contentType}, Response: ${text}`);
    }
  } catch (error) {
    log("Fetch error:", error);
    throw new Error(`Network Error: ${error.message}`);
  }
};
