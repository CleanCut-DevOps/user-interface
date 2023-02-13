import { Carousel } from "@mantine/carousel";
import { createStyles, Divider, Flex, Grid, SimpleGrid, Stack, Text, Title } from "@mantine/core";

import { FC } from "react";
import { TbPhoto } from "react-icons/tb";

import { Property } from "~/models";

interface ComponentProps {
    property: Property;
}

const useCarouselStyles = createStyles(theme => ({
    placeholderWrapper: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        border: `2px dashed ${theme.colorScheme == "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`
    },
    placeholderContent: {
        display: "flex",
        maxWidth: "80%",
        userSelect: "none",
        alignItems: "center",
        gap: theme.spacing.sm
    },
    carouselContainer: {
        flex: 1,
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden"
    },
    image: {
        zIndex: 1,
        height: "100%",
        width: "100%",
        objectFit: "cover",
        objectPosition: "center"
    },

    container: {
        height: "100%",
        width: "100%"
    },
    control: {
        borderRadius: theme.radius.sm
    },
    controls: {},
    indicator: {},
    indicators: {},
    root: {
        height: "100%",
        width: "100%",
        borderRadius: theme.radius.sm,
        overflow: "hidden"
    },
    slide: {
        overflow: "hidden",
        position: "relative",
        borderRadius: theme.radius.sm
    },
    viewport: {
        height: "100%",
        width: "100%"
    }
}));

const useStyles = createStyles((theme, _, getRef) => ({
    stat: {
        fontSize: 16,
        color: theme.colorScheme == "dark" ? "white" : "black",
        fontWeight: theme.colorScheme == "dark" ? 600 : 700,

        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: 20
        }
    },
    address: {
        color: theme.colorScheme == "dark" ? "white" : "black"
    },
    sectionLabel: {
        fontSize: 16,
        marginBottom: 4,
        color: theme.colorScheme == "dark" ? "white" : "black",
        fontWeight: theme.colorScheme == "dark" ? 600 : 700,

        [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: 20
        }
    },
    room: {
        "&:hover": { [`& .${getRef("price")}`]: { opacity: 1 } }
    },
    price: {
        opacity: 0,
        ref: getRef("price"),
        transition: "opacity 150ms ease"
    }
}));

export const PropertyDetailsPanel: FC<ComponentProps> = ({ property }) => {
    const { classes } = useStyles();

    const { classes: carouselClasses } = useCarouselStyles();
    return (
        <Grid gutter={"xl"}>
            <Grid.Col span={12} md={4}>
                <div className={carouselClasses.carouselContainer}>
                    {property.images.length > 0 ? (
                        <Carousel loop={property.images.length > 5} withIndicators classNames={carouselClasses}>
                            {property.images.map((url, i) => (
                                <Carousel.Slide key={i}>
                                    <img src={url} className={carouselClasses.image} />
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    ) : (
                        <div className={carouselClasses.placeholderWrapper}>
                            <div className={carouselClasses.placeholderContent}>
                                <TbPhoto size={48} />
                                <Text
                                    inline
                                    size={"sm"}
                                    color={"dimmed"}
                                    sx={{ [`@media (max-width: 480px)`]: { display: "none" } }}
                                >
                                    Upload some images of your property!
                                </Text>
                            </div>
                        </div>
                    )}
                </div>
            </Grid.Col>
            <Grid.Col span={12} md={8}>
                <Stack spacing={20}>
                    <Stack spacing={0}>
                        <Title order={1} ff="Inter">
                            {property.address.line_1 && property.address.city ? (
                                <>
                                    <Text span className={classes.address}>
                                        {property.address.line_1}
                                    </Text>
                                    <Text span color="dimmed">
                                        , {property.address.city}
                                    </Text>
                                </>
                            ) : (
                                "No address"
                            )}
                        </Title>
                        <Title color="dimmed" ff="Inter" order={5} fw={600}>
                            {property.address.line_2 && <Text span>{property.address.line_2}</Text>}
                            {property.address.line_2 && property.address.state && <Text span>, </Text>}
                            {property.address.state && <Text span>{property.address.state}, </Text>}
                            <Text span color="dimmed">
                                {property.address.city} {property.address.zip}
                            </Text>
                        </Title>
                    </Stack>
                    <Divider />

                    <Flex direction={{ base: "column", md: "row" }}>
                        <Text className={classes.sectionLabel} style={{ flex: 3 }}>
                            Property type
                        </Text>
                        <div style={{ flex: 9, marginTop: 6 }}>
                            {property.type?.label ? (
                                <>
                                    <Text size="md" fw={600}>
                                        {property.type.label}
                                    </Text>
                                    <Text color="dimmed" size="md" fw={400}>
                                        {property.type.description}
                                    </Text>
                                </>
                            ) : (
                                <Text color="dimmed" size="md" fw={500}>
                                    Not chosen
                                </Text>
                            )}
                        </div>
                    </Flex>
                    <div>
                        <Text className={classes.sectionLabel}>Room types</Text>
                        {property.rooms.length > 0 ? (
                            <SimpleGrid cols={2} breakpoints={[{ minWidth: "xl", cols: 3 }]}>
                                {property.rooms.map((rooms, i) => (
                                    <div key={i} className={classes.room}>
                                        <Text color="dimmed" size="md" fw={500}>
                                            {rooms.type.label}s
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            <Text span className={classes.stat}>
                                                {rooms.quantity}
                                            </Text>{" "}
                                            <Text span className={classes.price}>
                                                × ${rooms.type.price.toFixed(2)}
                                            </Text>
                                        </Text>
                                    </div>
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Text color="dimmed" size="md" fw={500} span>
                                Rooms not set
                            </Text>
                        )}
                    </div>
                    <Flex direction={{ base: "column", md: "row" }}>
                        <Text className={classes.sectionLabel} style={{ flex: 3 }}>
                            Description
                        </Text>
                        <Text mt={6} style={{ flex: 9 }}>
                            {property.description ?? (
                                <Text color="dimmed" size="md" fw={500} span>
                                    No description
                                </Text>
                            )}
                        </Text>
                    </Flex>
                </Stack>
            </Grid.Col>
        </Grid>
    );
};
