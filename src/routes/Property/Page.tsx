import { FC } from "react";
import { AuthWrapper, Loading } from "~/components";

export const ProperyListing: FC = () => {
    return (
        <AuthWrapper requireAuth>
            <>App</>
        </AuthWrapper>
    );
};
