import { User } from "./User";

export type SuccessfulAuthenticationResponse = {
    type: string;
    message: string;
    token: string;
};

export type SuccessfulAccountResponse = {
    type: string;
    message: string;
    account: User;
};

export type UnauthorizedResponse = {
    type: string;
    message: string;
};

export type InvalidDataResponse = {
    type: string;
    message: string;
    errors: string[];
};
