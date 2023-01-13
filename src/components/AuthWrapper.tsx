import { FC, PropsWithChildren, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { Loading } from "./Loading";
import { UserContext } from "./UserProvider";

interface ComponentProps extends PropsWithChildren {
    requireAuth?: boolean;
}

export const AuthWrapper: FC<ComponentProps> = ({ requireAuth, children }) => {
    const [, setLocation] = useLocation();
    const { user, isLoading } = useContext(UserContext);

    useEffect(() => {
        if (!isLoading) {
            if (requireAuth && !user) setLocation("/login");
            else if (!requireAuth && user) setLocation("/");
        }
    }, [requireAuth, user, isLoading, setLocation]);

    if (isLoading || (requireAuth && !user) || (!requireAuth && user)) {
        return <Loading />;
    } else return <>{children}</>;
};
