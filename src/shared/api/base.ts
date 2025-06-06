import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { currentToken } from "./authorization";

class APIInstance {
    private axios: AxiosInstance;

    constructor () {
        this.axios = axios.create({
            baseURL: "https://api.spotify.com",
            timeout: 120000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    public async get<T>(
        endpoint: string, 
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        await currentToken.updateToken();

        const response: AxiosResponse<T> = await this.axios.get(
            endpoint,
            {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": "Bearer " + currentToken.access_token
                }
            }
        )
        return response.data;
    }

    public async post<T>(
        endpoint: string,
        data: any,
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        await currentToken.updateToken();

        return await this.axios.post(
            endpoint,
            data,
            {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": "Bearer " + currentToken.access_token
                }
            }
        )
    }

    public async put<T>(
        endpoint: string,
        data: any,
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        await currentToken.updateToken();

        return await this.axios.put(
            endpoint,
            data,
            {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": "Bearer " + currentToken.access_token
                }
            }
        )
    }

    public async delete<T>(
        endpoint: string,
        options: AxiosRequestConfig = {}
    ): Promise<T> {
        await currentToken.updateToken();

        return await this.axios.delete(
            endpoint,
            {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": "Bearer " + currentToken.access_token
                }
            }
        )
    }
}

export const apiInstance = new APIInstance();