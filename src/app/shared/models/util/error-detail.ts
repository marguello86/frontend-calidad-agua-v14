export interface ErrorDetail {
    title: string;
    message: string;
    buttons?: ButtonErrorDetail[];
}

export interface ButtonErrorDetail {
    code: string;
    name: string;
    disabled: boolean;
    color: string;
    icon?: IconErrorDetail;
    url?: string;
}

export interface IconErrorDetail {
    name: string;
}

