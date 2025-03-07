export class ResponseDTO<T = null> {
    code: number;
    message: string | null;
    data?: T | null;
    error?: string[] | null;

    constructor(code: number, message: string, data?: T, error?: string[]) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
