import { FC } from "react";
import { AuthWrapper } from "../../../components";

export const Property: FC = () => {
    return <AuthWrapper requireAuth>display property</AuthWrapper>;
};
