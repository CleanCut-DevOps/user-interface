import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./components";
import { Router } from "./router";

type ColorScheme = "light" | "dark";

const Main: FC = () => {
    const [cookie, setCookie] = useCookies(["mantine-color-scheme"]);
    const [colorScheme, setColorScheme] = useState<ColorScheme>(cookie["mantine-color-scheme"]);

    const toggleColorScheme = (value?: ColorScheme) => {
        let newScheme = value || (colorScheme === "dark" ? "light" : "dark");
        setColorScheme(newScheme);
        setCookie("mantine-color-scheme", newScheme, {
            maxAge: 60 * 60 * 24 * 30
        });
    };

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{ fontFamily: "Inter, sans-serif", colorScheme }}>
                <NotificationsProvider>
                    <QueryClientProvider client={new QueryClient()}>
                        <UserProvider>
                            <Router />
                        </UserProvider>
                    </QueryClientProvider>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

createRoot(document.getElementById("root") as HTMLElement).render(<Main />);
