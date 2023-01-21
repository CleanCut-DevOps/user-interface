import { Carousel } from "@mantine/carousel";
import { ActionIcon, Button, Card, Center, createStyles, Flex, SimpleGrid, Text } from "@mantine/core";
import { FC, useContext } from "react";
import { TbCalendarEvent, TbEye, TbPhoto } from "react-icons/tb";
import { PropMenu } from "../Menu";
import { PropertyCollectionContext } from "../Provider";

const useCarouselStyles = createStyles((theme, _, getRef) => ({
    container: {
        width: "100%",
        height: "100%"
    },
    control: {
        borderRadius: theme.radius.sm
    },
    controls: {
        opacity: 0,
        ref: getRef("controls"),
        transition: "opacity 150ms ease"
    },
    indicator: {},
    indicators: {},
    root: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: theme.radius.sm,

        "&:hover": { [`& .${getRef("controls")}`]: { opacity: 1 } }
    },
    slide: {
        overflow: "hidden",
        position: "relative",
        borderRadius: theme.radius.sm
    },
    viewport: {
        width: "100%",
        height: "100%"
    }
}));

const useStyles = createStyles(theme => ({
    cardBody: {
        display: "flex",
        flexDirection: "column"
    },
    cardTitle: {
        fontWeight: 600,
        fontSize: theme.fontSizes.md
    },
    cardRoot: {
        transition: "transform 400ms ease",

        "&:hover": { transform: "translateY(4px)" }
    },
    cardNoImage: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: theme.radius.sm,
        outline:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.gray[7]}` : `1px solid ${theme.colors.gray[2]}`
    },
    image: {
        zIndex: 1,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center"
    }
}));

export const GridProperties: FC = () => {
    const { classes } = useStyles();
    const { properties, isLoading } = useContext(PropertyCollectionContext);
    const { classes: carouselClasses } = useCarouselStyles();

    if (isLoading) return <>Loading Grid view</>;

    if (properties.length < 1) return <>No properties found</>;

    return (
        <SimpleGrid cols={4} px={"sm"}>
            {properties.map((property, i) => {
                return (
                    <Card key={i} shadow={"sm"} p={"sm"} radius={"md"} withBorder className={classes.cardRoot}>
                        <Card.Section p={"sm"}>
                            <Flex align={"center"} gap={"sm"}>
                                <div style={{ flex: 1 }}>
                                    <Text lineClamp={1} className={classes.cardTitle}>
                                        {property.label}
                                    </Text>
                                    <Text lineClamp={1} color={"dimmed"} size={"xs"}>
                                        {property.address.city && property.address.line_1
                                            ? `${property.address.city}, ${property.address.line_1}`
                                            : "Address not given"}
                                    </Text>
                                </div>
                                <PropMenu prop={property} />
                            </Flex>
                        </Card.Section>
                        <Card.Section style={{ aspectRatio: "16/9" }}>
                            {property.images.length > 0 ? (
                                <Carousel withIndicators loop={property.images.length > 5} classNames={carouselClasses}>
                                    {property.images.map((url, i) => (
                                        <Carousel.Slide key={i}>
                                            <img src={url} className={classes.image} />
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            ) : (
                                <Center className={classes.cardNoImage}>
                                    <TbPhoto size={"25%"} />
                                </Center>
                            )}
                        </Card.Section>
                        <Card.Section p={"sm"}>
                            <Flex gap={"sm"}>
                                <ActionIcon variant={"light"} size={36} color={"indigo"}>
                                    <TbEye />
                                </ActionIcon>
                                <Button w={"100%"} color={"indigo"} variant={"light"} leftIcon={<TbCalendarEvent />}>
                                    Book now
                                </Button>
                            </Flex>
                        </Card.Section>
                    </Card>
                );
            })}
        </SimpleGrid>
    );
};
