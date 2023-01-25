import { FC } from "react";

import { AuthWrapper, DashboardLayout } from "~/components";

export const ProperyListing: FC = () => {
    return (
        <AuthWrapper requireAuth>
            <DashboardLayout>
                {[...new Array(100).keys()].map(k => (
                    <div key={k}>App {k}</div>
                ))}
            </DashboardLayout>
        </AuthWrapper>
    );
};
