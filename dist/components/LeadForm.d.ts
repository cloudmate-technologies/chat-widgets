type LeadFormProps = {
    onSubmit: (data: LeadFormData) => void;
    onClose?: () => void;
};
export type LeadFormData = {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    contactDate?: string;
    companySize?: string;
};
export declare const LeadForm: (props: LeadFormProps) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=LeadForm.d.ts.map