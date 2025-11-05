export interface FAQCategoryAttributes {
    id?: number;
    name: string;
    slug?: string;
    description?: string;
    status?: "Y" | "N";
    deleted?: "Y" | "N";
    createdAt?: Date;
    updatedAt?: Date;
    response?: any
};

export interface FAQAttributes {
    id?: number;
    category_id?: number | null;
    question: string;
    answer: string;
    slug?: string;
    status?: "Y" | "N";
    deleted?: "Y" | "N";
    createdAt?: Date;
    updatedAt?: Date;
};