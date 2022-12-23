import {
    Avatar,
    createStyles,
    Group,
    Text,
    UnstyledButton,
    UnstyledButtonProps
} from "@mantine/core";
import { TbSettings } from "react-icons/tb";

const useStyles = createStyles(theme => ({
    user: {
        display: "block",
        width: "100%",
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0]
        }
    }
}));

interface UserButtonProps extends UnstyledButtonProps {
    image?: string | null;
    name: string;
    email: string;
    icon?: JSX.Element;
}

export function UserButton({ image, name, email, ...others }: UserButtonProps) {
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Avatar src={image} radius="xl" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {name}
                    </Text>

                    <Text color="dimmed" size="xs">
                        {email}
                    </Text>
                </div>

                <TbSettings size={14} />
            </Group>
        </UnstyledButton>
    );
}
