import { createStyles, Grid, ScrollArea, Text, Title } from "@mantine/core";
import { FC, ReactNode } from "react";
import { Description } from "./Description";
import { Identifier } from "./Identifier";
import { ImagePreview } from "./ImagesPreview";
import { Label } from "./Label";

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
        gap: theme.spacing.md,
        flexDirection: "column"
    },
    container: {
        flex: 1,
        width: "100%",
        height: "min-content",
        maxWidth: theme.breakpoints.sm,
        maxHeight: "100%",
        overflow: "hidden",
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    },
    scrollArea: {
        height: "100%",
        width: "100%",
        maxWidth: "768px",
        overflowX: "hidden"
    }
}));

export const Details: FC = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Title>Your property details</Title>
            <Text color={"dimmed"}>This information will be used for our cleaners and yourself.</Text>
            <div className={classes.container}>
                <ScrollArea h={"100%"} scrollbarSize={8}>
                    <Grid w={"100%"} columns={11}>
                        <Row req label={"Identifier"}>
                            <Identifier />
                        </Row>
                        <Row req label={"Label"}>
                            <Label />
                        </Row>
                        <Row label={"Description"}>
                            <Description />
                        </Row>
                        <Row label={"Images"}>
                            <ImagePreview />
                        </Row>
                    </Grid>
                </ScrollArea>
            </div>
        </div>
    );
};

type RowProps = {
    label: string;
    req?: boolean;
    children: ReactNode | undefined;
};

const Row: FC<RowProps> = ({ label, req, children }) => {
    return (
        <>
            <Grid.Col span={3}>
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>{children}</Grid.Col>
        </>
    );
};
