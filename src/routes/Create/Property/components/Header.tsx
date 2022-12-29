import { Box, Button, createStyles, Group } from "@mantine/core";
import { FC, useContext } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { PropertyCreationContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        position: "relative",
        margin: theme.spacing.lg
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : "white"
    },
    stepper: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }
}));

export const Header: FC = () => {
    const { classes } = useStyles();
    const { propertyType, rooms, address, images } = useContext(
        PropertyCreationContext
    );

    return (
        <Box className={classes.wrapper}>
            <Group className={classes.buttonGroup} position={"apart"}>
                <Button
                    variant={"light"}
                    color={"indigo"}
                    leftIcon={<TbChevronLeft size={20} />}
                >
                    Back
                </Button>
                <Button
                    variant={"light"}
                    color={"indigo"}
                    rightIcon={<TbChevronRight size={20} />}
                >
                    Next
                </Button>
            </Group>
            <Box className={classes.stepper}></Box>
        </Box>
    );
};
