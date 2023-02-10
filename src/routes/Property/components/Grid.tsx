import { Carousel } from "@mantine/carousel";
import { ActionIcon, Button, Card, Center, createStyles, Flex, Indicator, SimpleGrid, Text } from "@mantine/core";

import axios from "axios";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbCalendarEvent, TbHeart, TbHeartPlus, TbPhoto } from "react-icons/tb";
import { useLocation } from "wouter";

import { useProperties } from "~/hooks";
import { convertResponseToProperty, Property } from "~/models";

import { PropMenu } from "./Menu";

interface ComponentProps {
    sort: "alphabetical" | "created" | "updated";
}

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
    cardRoot: {
        overflow: "visible",
        transition: "transform 400ms ease",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderColor: theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[3]
    },
    cardNoImage: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderTop:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.gray[7]}` : `1px solid ${theme.colors.gray[2]}`,
        borderBottom:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.gray[7]}` : `1px solid ${theme.colors.gray[2]}`
    },
    image: {
        zIndex: 1,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center"
    },
    favouriteIcon: {
        color: theme.colorScheme == "dark" ? theme.colors.red[7] : theme.colors.red[5],
        fill: theme.colorScheme == "dark" ? theme.colors.red[7] : theme.colors.red[5]
    }
}));

export const GridView: FC<ComponentProps> = ({ sort }) => {
    const [cookies] = useCookies(["AccessToken"]);
    const { data } = useProperties(cookies.AccessToken);

    // states
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (data) {
            const newProperties = [...data.properties]
                .map((p: any) => convertResponseToProperty(p))
                .sort((a, b) => {
                    if (sort == "alphabetical") {
                        return a.label.localeCompare(b.label);
                    } else if (sort == "created") {
                        return b.created_at.getTime() - a.created_at.getTime();
                    } else if (sort == "updated") {
                        return b.updated_at.getTime() - a.updated_at.getTime();
                    }

                    return 0;
                });

            setProperties(newProperties);
        }
    }, [sort, data]);

    return (
        <SimpleGrid
            cols={1}
            breakpoints={[
                { minWidth: 425, cols: 2 },
                { minWidth: "md", cols: 3 },
                { minWidth: 1200, cols: 4 }
            ]}
        >
            {properties.map((p, i) => (
                <PropertyCard key={i} property={p} setProperties={setProperties} />
            ))}
        </SimpleGrid>
    );
};

const PropertyCard: FC<{ property: Property; setProperties: Dispatch<SetStateAction<Property[]>> }> = ({
    property,
    setProperties
}) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [cookies] = useCookies(["AccessToken"]);
    const { classes: carouselClasses } = useCarouselStyles();
    const [state, setState] = useState<"incomplete" | "unverified" | "active" | null>(null);

    useEffect(() => {
        if (
            property.icon == null ||
            property.label == null ||
            property.address.line_1 == null ||
            property.address.city == null ||
            property.address.zip == null ||
            property.type == null ||
            property.user_id == null ||
            property.rooms.length < 0
        ) {
            setState("incomplete");
        } else if (property.verified_at == null) {
            setState("unverified");
        } else {
            setState("active");
        }
    }, [property]);

    const handleFavourite = () => {
        axios.put(
            `${import.meta.env.VITE_PROPERTY_API}/${property.id}`,
            { favourite: property.favourite_at == null },
            { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
        );

        setProperties(prev => {
            const index = prev.findIndex(p => p.id === property.id);

            const newProperties = [...prev];

            newProperties[index].favourite_at = newProperties[index].favourite_at == null ? new Date() : null;

            return newProperties;
        });
    };

    return (
        <Indicator
            inline
            size={10}
            offset={20}
            processing={true}
            styles={{ processing: { zIndex: 10 } }}
            color={state == "active" ? "teal" : state == "incomplete" ? "red" : "yellow"}
        >
            <Card shadow="xs" p="sm" radius="md" withBorder className={classes.cardRoot}>
                <Card.Section p="sm">
                    <Text lineClamp={1} size="md" weight={600}>
                        {property.address.line_1 ?? "Address not given"}
                    </Text>
                    <Text lineClamp={1} color="dimmed" size="xs">
                        {property.address.city ?? "City not specified"}
                    </Text>
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
                            <TbPhoto size="25%" />
                        </Center>
                    )}
                </Card.Section>
                <Card.Section p="sm">
                    <Flex align="center" gap="sm">
                        <Text lineClamp={1} size="md" weight={600} sx={{ flex: 1 }}>
                            {property.label ?? "Address not given"}
                        </Text>
                        <ActionIcon size="lg" radius="sm" variant="transparent" onClick={handleFavourite}>
                            {property.favourite_at ? <TbHeart className={classes.favouriteIcon} /> : <TbHeartPlus />}
                        </ActionIcon>
                    </Flex>
                    <Flex mt={8} gap="sm">
                        <Button
                            w="100%"
                            variant="outline"
                            leftIcon={<TbCalendarEvent />}
                            onClick={() => setLocation(`/bookings/new?id=${property.id}`)}
                        >
                            Book now
                        </Button>
                        <PropMenu prop={property} setProperties={setProperties} position="bottom-start" size="lg" />
                    </Flex>
                </Card.Section>
            </Card>
        </Indicator>
    );
};
