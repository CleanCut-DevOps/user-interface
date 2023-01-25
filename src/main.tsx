import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { createRoot } from "react-dom/client";
import { Route } from "wouter";

import { UserProvider } from "./components";
import { Auth, EditProperty, ProperyListing } from "./routes";

const Main: FC = () => {
    const [cookie, setCookie] = useCookies(["mantine-color-scheme"]);
    const [colorScheme, setColorScheme] = useState<ColorScheme>(cookie["mantine-color-scheme"]);

    const toggleColorScheme = (value?: ColorScheme) => {
        let newScheme = value ?? (colorScheme === "dark" ? "light" : "dark");
        setColorScheme(newScheme);
        setCookie("mantine-color-scheme", newScheme, { maxAge: 60 * 60 * 24 * 30 });
    };

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{ fontFamily: "Inter, sans-serif", colorScheme }}>
                <NotificationsProvider>
                    <ModalsProvider>
                        <UserProvider>
                            <Route path={"/"} component={ProperyListing} />
                            <Route path={"/login"}>
                                <Auth type={"login"} />
                            </Route>
                            <Route path={"/register"}>
                                <Auth type={"register"} />
                            </Route>
                            <Route path="/property/:id/edit" component={EditProperty} />
                        </UserProvider>
                    </ModalsProvider>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

createRoot(document.getElementById("root") as HTMLElement).render(<Main />);
