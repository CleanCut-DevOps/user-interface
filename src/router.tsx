import { FC, useContext, useEffect } from "react";
import { Route, useLocation } from "wouter";
import { Dashboard, Login, Register } from "./routes";
import { UserContext } from "./components/UserProvider";

export const Router: FC = () => {
    const [location, setLocation] = useLocation();
    const { user, isLoading } = useContext(UserContext);

    useEffect(() => {
        console.log(location);

        if (!isLoading) {
            switch (location) {
                case "/":
                    if (!user) setLocation("/login");
                    break;
                case "/login":
                    if (user) setLocation("/");
                    break;
                case "/register":
                    if (user) setLocation("/");
                    break;
            }
        }
    }, [location, user, isLoading, setLocation]);

    if (isLoading) {
        return <div>Loading...</div>;
    } else
        return (
            <>
                <Route path={"/"} component={Dashboard} />
                <Route path={"/login"} component={Login} />
                <Route path={"/register"} component={Register} />
            </>
        );
};
