export type APIResponse = {
    LOGIN_SUCCESS: {
        message: string;
    };
    LOGIN_ERROR: {
        message: string;
    };
    USER_SUCCESS: {
        email: string;
        roles: string[];
    };
    USER_ERROR: {
        code: number;
        message: string;
    };
    REGISTER_ERROR: {
        errors: {
            email?: string;
            password?: string;
        };
    };
    REGISTER_SUCCESS: {
        message: string;
    };
    USER_PROFILE: {
        email: string;
        lastName: string;
        firstName: string;
        company: string | null;
        newsletterOptin: boolean;
        isVerified: boolean;
        isAnonymous: boolean;
        roles: string[];
        createdAt: {
            date: string;
            timezone_type: number;
            timezone: string;
        };
        updatedAt: {
            date: string;
            timezone_type: number;
            timezone: string;
        } | null;
    };
};

export type APIResponseType<T> = {
    error: string | null;
    message: string | null;
    data: T | null;
};

export type NavLink = {
    label: string;
    href: string;
    navbar: boolean;
    available: boolean;
};

export type ImgProps = { src: `/images/${string}` | string; alt: string; width: number; height: number };

export type CartProductType = {
    id: string;
    name: string;
    price: string;
    img: ImgProps;
    unit: string;
};

export type FaqType = {
    id: string;
    question: string;
    answer: string;
};

export type IconProps = {
    width: number;
    height: number;
};

export type RouteType = {
    label: string;
    href: string;
    Page: () => React.JSX.Element;
};
