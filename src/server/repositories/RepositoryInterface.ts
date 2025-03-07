export interface RepositoryInterface<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(item: T): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}
