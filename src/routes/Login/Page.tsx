import { FC } from "react";
import {
    Blockquote,
    Box,
    createStyles,
    Paper,
    Stack,
    Text
} from "@mantine/core";

const useStyles = createStyles(theme => ({
    wrapper: {
        height: "100vh",
        padding: "2rem",
        display: "flex",
        gap: "2rem"
    },
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
    informationTitle: {
        fontSize: 22,
        fontWeight: 500,
        marginTop: 24,
        letterSpacing: 1.5
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
    formPanel: {
        flex: 1
    }
}));

export const Login: FC = () => {
    const { classes } = useStyles();
    return (
        <Paper className={classes.wrapper}>
            <Box className={classes.informationPanel}>
                <Text className={classes.informationTitle}>CleanCut</Text>
                <Stack align={"start"} justify={"start"} spacing={36}>
                    <Stack spacing={"xs"}>
                        <Text className={classes.informationCTA}>
                            Start your
                        </Text>
                        <Text className={classes.informationCTA}>
                            journey with us.
                        </Text>
                    </Stack>
                    <Text size={24} color={"#bbbbbb"}>
                        Digitalized cleaning services at your fingertips.
                    </Text>
                </Stack>
                <Blockquote
                    className={classes.informationQuote}
                    cite="– Forrest Gump">
                    Simply unbelievable how easy it is to interact with
                    CleanCut. I can't wait to see what the future holds for this
                    company.
                </Blockquote>
            </Box>
            <Box className={classes.formPanel}>form</Box>
        </Paper>
    );
};
