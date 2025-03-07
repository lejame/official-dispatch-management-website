export class DocumentCategoryDTO {
    documentCategoryId?: string;
    name?: string;

    constructor(documentCategoryId: string | undefined, name: string) {
        this.documentCategoryId = documentCategoryId;
        this.name = name;
    }
}
