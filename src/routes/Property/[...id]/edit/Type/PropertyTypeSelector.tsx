import { Checkbox, createStyles, SimpleGrid, Skeleton, Text, Title, UnstyledButton } from "@mantine/core";
import { FC } from "react";
import { PropertyType } from "../../../../../models";

type ComponentProps = {
    pType: { data: PropertyType[]; isLoading: boolean; isError: boolean; isSuccess: boolean };
    typeId: string | null;
    handleTypeChange: (i: string) => () => void;
};

const useStyles = createStyles(theme => ({
    labels: {
        width: "100%",
        maxWidth: 768,
        marginTop: 16,
        display: "flex",
        gap: theme.spacing.xs,
        flexDirection: "column",
        marginBottom: 2 * theme.spacing.xs
    },
    disabled: {
        width: "100%",
        display: "flex",
        gap: theme.spacing.md,
        transition: "0.2s ease",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[4],
        border:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`,

        "&:hover": {
            cursor: "default"
        }
    },
    button: {
        width: "100%",
        display: "flex",
        gap: theme.spacing.md,
        transition: "0.2s ease",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
        border:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
        }
    }
}));

export const PropertyTypeSelector: FC<ComponentProps> = ({ pType, typeId, handleTypeChange }) => {
    const { classes } = useStyles();
    const { data, isLoading, isSuccess } = pType;

    return (
        <>
            <div className={classes.labels}>
                <Title order={4}>Which of these best describes your place?</Title>
            </div>
            <SimpleGrid
                w={"100%"}
                maw={768}
                cols={2}
                spacing="xl"
                breakpoints={[
                    { maxWidth: 980, cols: 2, spacing: "md", verticalSpacing: "md" },
                    { maxWidth: 755, cols: 2, spacing: "sm", verticalSpacing: "sm" },
                    { maxWidth: 600, cols: 1, spacing: "sm", verticalSpacing: "xs" }
                ]}
            >
                {isLoading && [...Array(4)].map((_, i) => <Skeleton w={"100%"} key={i} height={100} />)}
                {isSuccess &&
                    data.map(type => {
                        let selected = typeId == type.id;
                        let disabled = type.available == false;

                        return (
                            <UnstyledButton
                                key={type.id}
                                className={disabled ? classes.disabled : classes.button}
                                disabled={disabled}
                                onClick={handleTypeChange(type.id)}
                            >
                                <Checkbox
                                    checked={selected}
                                    onChange={() => {}}
                                    disabled={disabled}
                                    styles={{ input: { cursor: "pointer" } }}
                                />
                                <div>
                                    <Text
                                        weight={500}
                                        mb={7}
                                        sx={{ lineHeight: 1 }}
                                        color={disabled ? "dimmed" : undefined}
                                    >
                                        {type.label}
                                    </Text>
                                    <Text lineClamp={2} size={"sm"} color={"dimmed"}>
                                        {type.description}
                                    </Text>
                                </div>
                            </UnstyledButton>
                        );
                    })}
            </SimpleGrid>
        </>
    );
};
