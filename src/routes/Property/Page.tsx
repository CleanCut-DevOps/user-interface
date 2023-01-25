import { FC } from "react";

import { AuthWrapper, DashboardLayout } from "~/components";

export const ProperyListing: FC = () => {
    return (
        <AuthWrapper requireAuth>
            <DashboardLayout>App</DashboardLayout>
        </AuthWrapper>
    );
};
