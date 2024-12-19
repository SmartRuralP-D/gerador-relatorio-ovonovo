import axios from 'axios';

const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOSTNAME,
    });


// request interceptor
apiInstance.interceptors.request.use((request) => {
    //console.log('Starting Request', request)
    return request
})

// response interceptor
apiInstance.interceptors.response.use((response) => {
    //console.log('Response:', response)
    return response
})

export { apiInstance };
