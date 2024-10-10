export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    // Remove Content-Type if bodyData is FormData, let fetch handle it
    if (bodyData instanceof FormData) {
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = 'application/json';
    }
    
    const options = {
      method: method.toUpperCase(),
      headers: headers,
    };

    // Set the body to bodyData (either FormData or JSON string)
    if (bodyData) {
      options.body = bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData);
    }

    // Handle query parameters
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const requestUrl = `${url}${queryString}`;

    // Log the full request details

    // Make the fetch request
    const response = await fetch(requestUrl, options);

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Unexpected content-type: ${contentType}, Response: ${text}`);
    }

    // Handle server errors gracefully
    if (response.status === 500) {
      data.message = "Server is down, please try again later";
    }
    
    return data;
  } catch (error) {
    console.error("API Connector Error:", error);
    return {
      success: false,
      message: 'Server Error occurred',
      status: null,
    };
  }
};
