import { log } from './log';

export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = bodyData instanceof FormData ? 'multipart/form-data' : 'application/json';
    }
    
    const options = {
      method: method.toUpperCase(),
      headers: headers,
    };

    if (bodyData) {
      if (headers['Content-Type'] === 'multipart/form-data') {
        options.body = bodyData;
      } else {
        options.body = JSON.stringify(bodyData);
      }
    }

    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const requestUrl = `${url}${queryString}`;

    log(`${requestUrl} \n`,`Options:`, options);
    
    const response = await fetch(requestUrl, options);

    let data;
    // data.status = response.status
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } 
    else {
      const text = await response.text();
      throw new Error(`Unexpected content-type: ${contentType}, Response: ${text}`);
    }
    if(response.status === 500) {
      log(data.message)
      data.message = "Server is down, please try again later"
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Server Error occurred',
      status: null,
    };
  }
};
