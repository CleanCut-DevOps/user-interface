import { FC } from "react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles(theme => ({
    collectionLink: {
        display: "block",
        padding: `8px ${theme.spacing.xs}px`,
        textDecoration: "none",
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.xs,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        lineHeight: 1,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black
        }
    }
}));

const collections = [
    { emoji: "👍", label: "Sales" },
    { emoji: "🚚", label: "Deliveries" },
    { emoji: "💸", label: "Discounts" },
    { emoji: "💰", label: "Profits" },
    { emoji: "✨", label: "Reports" },
    { emoji: "🛒", label: "Orders" },
    { emoji: "📅", label: "Events" },
    { emoji: "🙈", label: "Debts" },
    { emoji: "💁‍♀️", label: "Customers" },
    { emoji: "👍", label: "Sales" },
    { emoji: "🚚", label: "Deliveries" },
    { emoji: "💸", label: "Discounts" },
    { emoji: "💰", label: "Profits" },
    { emoji: "✨", label: "Reports" },
    { emoji: "🛒", label: "Orders" },
    { emoji: "📅", label: "Events" },
    { emoji: "🙈", label: "Debts" },
    { emoji: "💁‍♀️", label: "Customers" },
    { emoji: "👍", label: "Sales" },
    { emoji: "🚚", label: "Deliveries" },
    { emoji: "💸", label: "Discounts" },
    { emoji: "💰", label: "Profits" },
    { emoji: "✨", label: "Reports" },
    { emoji: "🛒", label: "Orders" },
    { emoji: "📅", label: "Events" },
    { emoji: "🙈", label: "Debts" },
    { emoji: "💁‍♀️", label: "Customers" }
];

export const PropertyList: FC = () => {
    const { classes } = useStyles();
    const collectionLinks = collections.map((collection, index) => (
        <a
            href={"/"}
            key={index}
            className={classes.collectionLink}
            onClick={event => event.preventDefault()}
        >
            <span style={{ marginRight: 9, fontSize: 16 }}>
                {collection.emoji}
            </span>{" "}
            {collection.label}
        </a>
    ));

    return <> {collectionLinks} </>;
};
