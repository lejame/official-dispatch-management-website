import { Request, Response } from 'express';

const get = async (request: Request, response: Response) => {
    return response.send({
        code: 200,
        message: 'OK'
    });
};

const getRandomMessage = async (request: Request, response: Response) => {
    return response.send({
        code: 200,
        message: 'This is a random message'
    });
};

export const homeController = { get, getRandomMessage };
