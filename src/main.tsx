import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

createRoot(document.getElementById("root") as HTMLElement).render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
            <main>Hello World</main>
        </NotificationsProvider>
    </MantineProvider>
);
