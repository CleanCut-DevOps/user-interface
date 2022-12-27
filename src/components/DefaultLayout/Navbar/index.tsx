import { createStyles, Navbar } from "@mantine/core";
import { FC } from "react";
import { NavLinks } from "./NavLinks";
import { NavPropertyList } from "./NavPropertyList";
import { NavUser } from "./NavUser";

const useStyles = createStyles(() => ({
    navbar: {
        transition: "0.4s ease"
    }
}));

export const LayoutNavbar: FC = () => {
    const { classes } = useStyles();

    return (
        <Navbar className={classes.navbar} width={{ base: 280 }}>
            <NavUser />
            <NavLinks />
            <NavPropertyList />
        </Navbar>
    );
};
