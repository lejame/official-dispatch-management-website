import { Request, Response } from 'express';
import { container } from '../core/configs/container.config';
import { handleError } from '../core/configs/errorHandler';
import { DepartmentService } from '../services/DepartmentService';
import { TYPES } from '../types';
import { DepartmentDTO } from '../dtos/DepartmentDTO';

const departmentService = container.get<DepartmentService>(TYPES.DepartmentService);

const getAll = async (request: Request, response: Response) => {
    try {
        const responseDTO = await departmentService.getAllDepartment();

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const createDepartment = async (request: Request, response: Response) => {
    try {
        const { name } = request.body;
        const departmentDTO = new DepartmentDTO(undefined, name);
        const responseDTO = await departmentService.createDepartment(departmentDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const updateDepartment = async (request: Request, response: Response) => {
    try {
        const { id, name } = request.body;
        const departmentDTO = new DepartmentDTO(id, name);
        const responseDTO = await departmentService.updateDepartment(departmentDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

const deleteDepartment = async (request: Request, response: Response) => {
    try {
        const { id } = request.body;
        const departmentDTO = new DepartmentDTO(id, '');
        const responseDTO = await departmentService.deleteDepartment(departmentDTO);

        return response.status(responseDTO.code).send(responseDTO);
    } catch (error: unknown) {
        return handleError(response, error);
    }
};

export const departmentController = { getAll, createDepartment, updateDepartment, deleteDepartment };
