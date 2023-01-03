import { FC } from "react";
import { AuthWrapper } from "../../../../components";

type RouteProps = { params: { id: string } };

export const EditProperty: FC<RouteProps> = ({ params }) => {
    const { id } = params;

    return <AuthWrapper requireAuth>edit property</AuthWrapper>;
};
