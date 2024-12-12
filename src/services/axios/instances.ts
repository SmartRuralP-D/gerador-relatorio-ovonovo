import axios from 'axios';

const firebaseInstance = axios.create({
    baseURL: 'https://firestore.googleapis.com/v1/projects/your-project-id/databases/(default)/documents',
    });

const thingsBoardInstance = axios.create({
    baseURL: 'https://thingsboard.cloud/api/v1',
    });

firebaseInstance.interceptors.request.use((request) => {
    //console.log('Starting Request', request)
    return request
})

firebaseInstance.interceptors.response.use((response) => {
    //console.log('Response:', response)
    return response
})

thingsBoardInstance.interceptors.request.use((request) => {
    //console.log('Starting Request', request)
    return request
})

thingsBoardInstance.interceptors.response.use((response) => {
    //console.log('Response:', response)
    return response
})

// TODO: credentials for firebaseInstance

export { firebaseInstance, thingsBoardInstance };
