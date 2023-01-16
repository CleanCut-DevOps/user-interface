import { FC } from "react";
import { Route } from "wouter";
import { EditProperty, Login, Property, PropertyListing, Register } from "./routes";

export const Router: FC = () => {
    return (
        <>
            <Route path={"/"} component={PropertyListing} />
            <Route path={"/login"} component={Login} />
            <Route path={"/register"} component={Register} />
            <Route path={"/property/:id"} component={Property} />
            <Route component={EditProperty} path={"/property/:id/edit"} />
        </>
    );
};
