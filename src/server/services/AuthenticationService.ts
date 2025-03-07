import { injectable, inject } from 'inversify';
import * as bcrypt from 'bcrypt';
import { TYPES } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import { LoginDTO } from '../dtos/authentication/LoginDTO';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { DEFAULTS } from '../core/constants/Defaults';

@injectable()
export class AuthenticationService {
    private userRepository: UserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async validateUser(loginDTO: LoginDTO): Promise<ResponseDTO<{ token: string } | null>> {
        const user = await this.userRepository.findByEmail(loginDTO.email);

        if (user) {
            if (user.isLocked) {
                return new ResponseDTO(403, 'Tài khoản của bạn đã bị khóa!', null, []);
            }

            if (bcrypt.compareSync(loginDTO.password, user.password)) {
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, DEFAULTS.JWT_SECRET, {
                    expiresIn: DEFAULTS.JWT_EXPIRES_IN
                });

                return new ResponseDTO(
                    200,
                    'Đăng nhập thành công',
                    {
                        token
                    },
                    []
                );
            }
        }

        return new ResponseDTO(401, 'Email hoặc mật khẩu không đúng!', null, []);
    }

    public async validateToken(token: string): Promise<boolean> {
        try {
            jwt.verify(token, DEFAULTS.JWT_SECRET);
            return true;
        } catch {
            return false;
        }
    }
}
