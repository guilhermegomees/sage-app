import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:8081", // se necessário, colocar ipv4:port para acessar api
})