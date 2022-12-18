import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Router } from "./router";

createRoot(document.getElementById("root") as HTMLElement).render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
            <Router />
        </NotificationsProvider>
    </MantineProvider>
);
