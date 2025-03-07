export class DepartmentDTO {
    id?: string;
    name?: string;

    constructor(id: string | undefined, name: string) {
        this.id = id;
        this.name = name;
    }
}
