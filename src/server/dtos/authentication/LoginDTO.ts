export class LoginDTO {
    email: string;
    password: string;

    public constructor(request: { body: { email: string; password: string } }) {
        if (request.body) {
            this.email = request.body.email;
            this.password = request.body.password;
        } else {
            this.email = '';
            this.password = '';
        }
    }
}
