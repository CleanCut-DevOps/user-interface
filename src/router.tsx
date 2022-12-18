import { FC } from "react";
import { Route } from "wouter";
import { Dashboard, Login, Register } from "./routes";

export const Router: FC = () => {
    return (
        <>
            <Route path={"/"} component={Dashboard} />
            <Route path={"/login"} component={Login} />
            <Route path={"/register"} component={Register} />
        </>
    );
};
