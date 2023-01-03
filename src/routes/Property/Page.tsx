import { FC } from "react";
import { AuthWrapper } from "../../components";

export const PropertyListing: FC = () => {
    return <AuthWrapper requireAuth>Display all properties</AuthWrapper>;
};
