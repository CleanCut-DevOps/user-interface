import { FC } from "react";
import { Route } from "wouter";

export const Router: FC = () => {
    return (
        <>
            <Route path={"/"}>
                <main>Hello World</main>
            </Route>
            <Route path={"/login"}>
                <main>Login to main content</main>
            </Route>
            <Route path={"/register"}>
                <main>Register for main content</main>
            </Route>
        </>
    );
};
