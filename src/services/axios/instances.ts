import axios from 'axios';

const thingsBoardInstance = axios.create({
    baseURL: 'https://thingsboard.cloud/api/v1',
    });

thingsBoardInstance.interceptors.request.use((request) => {
    //console.log('Starting Request', request)
    return request
})

thingsBoardInstance.interceptors.response.use((response) => {
    //console.log('Response:', response)
    return response
})

export { thingsBoardInstance };
