import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { createRoot } from "react-dom/client";
import { Route, Switch } from "wouter";

import { UserProvider } from "./components";
import {
    Auth,
    BookingCollection,
    EditProperty,
    NotFound,
    PropertyCollection,
    VerifyEmail,
    ViewProperty
} from "./routes";
import { NewBooking } from "./routes/Booking/New";

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
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    primaryColor: "indigo",
                    fontFamily: "Inter, sans-serif",
                    colorScheme,
                    globalStyles: () => ({
                        html: { display: "flex", minHeight: "100%", flexDirection: "column" },
                        body: { flex: 1, display: "flex", flexDirection: "column" },
                        "#root": { flex: 1, display: "flex", flexDirection: "column" },
                        "em-emoji-picker": { "--border-radius": "4px" }
                    })
                }}
            >
                <NotificationsProvider>
                    <ModalsProvider>
                        <UserProvider>
                            <Switch>
                                <Route path={"/"} component={PropertyCollection} />
                                <Route path={"/bookings"} component={BookingCollection} />
                                <Route path={"/bookings/new"} component={NewBooking} />
                                <Route path="/property/:id/edit" component={EditProperty} />
                                <Route path="/property/:id" component={ViewProperty} />
                                <Route path={"/login"}>
                                    <Auth type={"login"} />
                                </Route>
                                <Route path={"/register"}>
                                    <Auth type={"register"} />
                                </Route>
                                <Route path={"/verify-email"} component={VerifyEmail} />
                                <Route component={NotFound} />
                            </Switch>
                        </UserProvider>
                    </ModalsProvider>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

createRoot(document.getElementById("root") as HTMLElement).render(<Main />);
