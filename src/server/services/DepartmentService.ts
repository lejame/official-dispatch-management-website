import { injectable, inject } from 'inversify';
import { ResponseDTO } from '../dtos/ResponseDTO';
import { DepartmentModel, IDepartment } from '../models/Department';
import { DepartmentRepository } from '../repositories/DepartmentRepository';
import { TYPES } from '../types';
import { DepartmentDTO } from '../dtos/DepartmentDTO';

@injectable()
export class DepartmentService {
    private departmentRepository: DepartmentRepository;

    constructor(@inject(TYPES.DepartmentRepository) departmentRepository: DepartmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public async getAllDepartment(): Promise<ResponseDTO<IDepartment[] | null>> {
        const departments = await this.departmentRepository.findAll();

        return new ResponseDTO(200, 'Lấy danh sách phòng ban thành công', departments, []);
    }

    public async createDepartment(departmentDTO: DepartmentDTO): Promise<ResponseDTO<IDepartment | null>> {
        const errors = this.validateDepartment(departmentDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Tạo phòng ban thất bại', null, errors);
        }

        const existingDepartment = departmentDTO.name
            ? await this.departmentRepository.findByName(departmentDTO.name)
            : null;

        if (existingDepartment) {
            return new ResponseDTO(400, 'Tên phòng ban đã tồn tại', null, ['Tên phòng ban đã tồn tại']);
        }

        const department = new DepartmentModel({ name: departmentDTO.name });
        const newDepartment = await this.departmentRepository.create(department);

        return new ResponseDTO(201, 'Tạo phòng ban thành công', newDepartment, []);
    }

    private validateDepartment(departmentDTO: DepartmentDTO): string[] {
        const errors = [];

        if (!departmentDTO.name) {
            errors.push('Tên phòng ban không được để trống');
        }

        return errors;
    }

    public async updateDepartment(departmentDTO: DepartmentDTO): Promise<ResponseDTO<IDepartment | null>> {
        const errors = this.validateDepartment(departmentDTO);

        if (errors.length > 0) {
            return new ResponseDTO(400, 'Tạo phòng ban thất bại', null, errors);
        }

        if (!departmentDTO.id) {
            return new ResponseDTO(400, 'Cập nhật phòng ban thất bại', null, ['Id phòng ban không được để trống']);
        }

        const existingDepartment = await this.departmentRepository.findById(departmentDTO.id);

        if (!existingDepartment) {
            return new ResponseDTO(404, 'Phòng ban không tồn tại', null, ['Phòng ban không tồn tại']);
        }

        const updatedDepartment = await this.departmentRepository.update(departmentDTO.id, departmentDTO);

        return new ResponseDTO(200, 'Cập nhật phòng ban thành công', updatedDepartment, []);
    }

    public async deleteDepartment(departmentDTO: DepartmentDTO): Promise<ResponseDTO<IDepartment | null>> {
        if (!departmentDTO.id) {
            return new ResponseDTO(400, 'Xóa phòng ban thất bại', null, ['Id phòng ban không được để trống']);
        }

        const existingDepartment = await this.departmentRepository.findById(departmentDTO.id);

        if (!existingDepartment) {
            return new ResponseDTO(404, 'Phòng ban không tồn tại', null, ['Phòng ban không tồn tại']);
        }

        const deletedDepartment = await this.departmentRepository.delete(departmentDTO.id);

        return new ResponseDTO(200, 'Xóa phòng ban thành công', deletedDepartment, []);
    }
}
