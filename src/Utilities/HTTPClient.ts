import Axios from "axios";

const backend = Axios.create({
    baseURL: 'https://betapi.onyxtechnology.co.uk'
})


/**
 * axiosGet
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosGet = async (url: string) => {
    return get(backend, url)
}

/**
 * axiosGet
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuthaaa
 */
export const get = async (client = backend, url: string) => {
    let config;
    let noAuth = false;
    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
            },
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
            },
        };
    }
    const response = await client.get(url, config)
    return response.data
};

/**
 * axiosPost
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosPost = async (url: string, request: any) => {
    return post(backend, url, request)
}

/**
 * axiosPost
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const post = async (client = backend, url: string, request: any) => {
    let config;
    let noAuth = false;
    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    }
    const response = await client.post(url, request, config);
    return response.data;
};

/**
 * axiosDelete
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosDelete = async (url: string) => {
    return deleteRequest(backend, url)
}

/**
 * axiosDelete
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const deleteRequest = async (client = backend, url: string) => {
    let config;
    let noAuth = false;
    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    }
    const response = await client.delete(url, config);
    return response.data
};

/**
 * axiosPut
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosPut = async (url: string, request: Array<any>) => {
    return put(backend, url, request)
}

/**
 * putRequest
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const put = async (client = backend, url: string, request: Array<any>) => {
    let config;
    let noAuth = false;
    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
            }
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
            }
        };
    }
    const response = await client.put(url, request, config);
    return response.data;
};
