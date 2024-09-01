import { log } from './log';

// export const apiConnector = async (method, url, bodyData, headers = {}, params = {}) => {
//   headers['Content-Type'] = headers['Content-Type'] || 'application/json';

//   const options = {
//     method: method.toUpperCase(),
//     headers: headers,
//     body: bodyData ? JSON.stringify(bodyData) : undefined,
//   };
  
//   const queryString = params ? `?${new URLSearchParams(params)}` : '';
//   const requestUrl = `${url}${queryString}`;

//   log(`${requestUrl} \n`,`Options:`, options);

  // try {
  //   const response = await fetch(requestUrl, options);

  //   if (!response.ok) {
  //     console.log("Response not ok", response);
  //     throw new Error(`Request failed with status ${response.status}`);
  //   }

  //   const contentType = response.headers.get("content-type");
  //   if (contentType && contentType.includes("application/json")) {
  //     return await response.json();
  //   } else {
  //     const text = await response.text();
  //     throw new Error(`Unexpected content-type: ${contentType}, Response: ${text}`);
  //   }
  // } catch (error) {
  //   throw new Error(`Network Error: ${error.message}`);
  // }
// };






export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    
    const options = {
      method: method.toUpperCase(),
      headers: headers,
      body: bodyData ? JSON.stringify(bodyData) : undefined,
    };

    // const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    // const requestUrl = `${url}${queryString}`;

    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const requestUrl = `${url}${queryString}`;

    log(`${requestUrl} \n`,`Options:`, options);
    
    const response = await fetch(requestUrl, options);

    const data = await response.json();
    // data.status = response.status
    if(response.status === 500) {
      data.message = "Server is down, please try again later"
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return data;
    } 
    else {
        const text = await response.text();
        throw new Error(`Unexpected content-type: ${contentType}, Response: ${text}`);
    }
  } catch (error) {
    return {
      success: false,
      message: 'Server Error occurred',
      status: null,
    };
  }
};
