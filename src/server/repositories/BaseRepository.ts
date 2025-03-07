// src/repositories/BaseRepository.ts
import { Model, Document } from 'mongoose';
import { RepositoryInterface } from './RepositoryInterface';

export class BaseRepository<T extends Document> implements RepositoryInterface<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async create(item: T): Promise<T> {
        return this.model.create(item);
    }

    async update(id: string, item: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }
}
