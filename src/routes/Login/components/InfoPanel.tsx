import { FC } from "react";
import { Blockquote, Box, createStyles, Stack, Text } from "@mantine/core";

const useStyles = createStyles(theme => ({
    informationPanel: {
        height: "100%",
        color: "white",
        display: "flex",
        padding: "2rem",
        width: "100%",
        maxWidth: "450px",
        borderRadius: "1rem",
        flexDirection: "column",
        backgroundColor: "#3c37ff",
        justifyContent: "space-between",
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            display: "none"
        }
    },
    informationCTA: {
        fontSize: 48,
        lineHeight: 1,
        fontWeight: 500
    },
    informationQuote: {
        color: "#e0e0e0",
        padding: "1rem",
        fontSize: "1rem",
        borderRadius: "1rem",
        backgroundColor: "#2520e3"
    },
    panelLabel: {
        fontSize: 28,
        fontWeight: 600
    }
}));
export const InformationPanel: FC = () => {
    const { classes } = useStyles();

    return (
        <Box className={classes.informationPanel}>
            <Text className={classes.panelLabel} mt={24}>
                CleanCut
            </Text>
            <Stack align={"start"} justify={"start"} spacing={36}>
                <Text className={classes.informationCTA}>
                    Start your journey with us.
                </Text>
                <Text size={24} color={"#999"}>
                    Digitalized cleaning services at your fingertips.
                </Text>
            </Stack>
            <Blockquote
                mb={32}
                className={classes.informationQuote}
                cite="– Forrest Gump">
                Simply unbelievable how easy it is to interact with CleanCut. I
                can't wait to see what the future holds for this company.
            </Blockquote>
        </Box>
    );
};
