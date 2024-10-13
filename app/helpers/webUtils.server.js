import * as cheerio from "cheerio"

export function getHeaders(request) {
    const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

export function getContentType(request) {
  return request.headers.get("content-type");
}

export function isFormData(request) {
  return getContentType(request) === "application/x-www-form-urlencoded";
}

export function isJson(request) {
  return getContentType(request) === "application/json";
} 


export function getCookies(request) {
    let cookieHeader = request.headers.get("cookie");
    let cookies={};
    if (cookieHeader){
        cookieHeader.split(";").forEach(cookie => {
            let [name,...rest] = cookie.split("=");
            name=name?.trim();
            if (!name) {
                cookies[name] = decodeURIComponent(rest.join("=").trim());
            }
        });
    }
    return cookies;
}

export async function getFormData(request) {
    // Retrieve the form data from the incoming request
    const formData = await request.formData();
    const formDataEntries = {};
    for (const [key, value] of formData.entries()) {
    formDataEntries[key] = value;
    }
    return formDataEntries;
}

export function getSearchParamsAsJson(request) {
    // Create a URL object from the request URL
    const url = new URL(request.url);
    
    // Get all search parameters
    const searchParams = url.searchParams;
    
    // Convert search parameters to a JSON object
    const paramsObj={};
    searchParams.forEach((value, key) => {
        //console.log("key ",key);
        //console.log("value ",value);
      if (paramsObj[key]) {
        // If the key already exists, convert it to an array and add the new value
        if (Array.isArray(paramsObj[key])) {
          paramsObj[key].push(value);
        } else {
          paramsObj[key] = [paramsObj[key], value];
        }
      } else {
        paramsObj[key] = value;
      }
    });
    
    return paramsObj;
}
  
//// web processors

/// extracts URLs from a string as a list only https://...
export function extractURLsFromString(str) {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const urls = [];

  let match;
  while ((match = urlRegex.exec(str)) !== null) {
    urls.push(match[0]);
  }

  return urls;
}


// checks if string is a valid URL
export function isValidURL(str) {
  try{
    new URL(str);
    return true;
  } catch (error) {
    return false;     
  }  
}

// html(body) to text
export function htmlToText(html) {
  const $ = cheerio.load(html);
  $('script, style').remove();
  let text = $('body').text();
  // replace multiple ' ' and multiple '\n'  single ' ' and trim 
  text = text.replace(/\s+/g, ' ').replace(/\n/g, '').trim();
  return text;
}

export async function extractHTMLFromURL(url) {
  if (isValidURL(url)) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      return html;
    } catch (error) {
      console.error('Error fetching HTML:', error);
      return null;
    }
  }
}

export async function extractTextFromURLOrHTML(urlOrHtml) {
  // Check if the input is a URL or HTML content
   const isUrl = urlOrHtml.startsWith('http');
   if (isUrl) {
      const html = await extractHTMLFromURL(urlOrHtml);
      if (html) {
         const textContent = htmlToText(html);
         return textContent;
      } else {
         return null;
      }
   } else {
      // Assume it's HTML content
      const textContent = htmlToText(urlOrHtml);
      return textContent;
   }
}
