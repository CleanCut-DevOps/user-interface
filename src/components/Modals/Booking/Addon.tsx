import {
    ActionIcon,
    Center,
    createStyles,
    Flex,
    Group,
    NumberInput,
    Paper,
    Text,
    useMantineTheme
} from "@mantine/core";

import { FC, useState } from "react";
import { TbMinus, TbPlus } from "react-icons/tb";

type ComponentProps = {
    item: {
        id: string;
        label: string;
        price: number;
        products: string[];
    };
};

const useStyles = createStyles(theme => ({
    wrapper: {
        display: "flex"
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        borderRadius: theme.radius.sm
    },
    group: {
        gap: 12,
        width: "100%",
        alignItems: "start",
        flexDirection: "column"
    },
    input: {
        width: 36,
        textAlign: "center",
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]
    }
}));

export const Addons: FC<ComponentProps> = ({ item: { price, products, label, id } }) => {
    const [value, setValue] = useState(0);
    const theme = useMantineTheme();
    const { classes } = useStyles();

    const handleClick = (type: "increment" | "decrement") => () => {
        switch (type) {
            case "increment":
                setValue(value < 10 ? value + 1 : value);
                break;
            case "decrement":
                setValue(value > 0 ? value - 1 : value);
                break;
        }
    };

    const handleChange = (num: number) => setValue(num);

    return (
        <Paper py={4} px="sm" withBorder radius="sm" className={classes.wrapper}>
            <Flex className={classes.group} py={4}>
                <Group spacing={4}>
                    <Text
                        inline
                        size="sm"
                        sx={{ transition: "0.2s ease" }}
                        color={value > 0 ? (theme.colorScheme == "dark" ? "white" : "black") : undefined}
                    >
                        {label}
                    </Text>
                    <Text size="sm" color="dimmed" inline>
                        (${price.toFixed(2)} / unit)
                    </Text>
                </Group>
                <Group spacing={4}>
                    {products.map((product, index) => (
                        <Text size="sm" color="dimmed" inline lh={1.2} key={index}>
                            {product}
                            {index < products.length - 1 ? "," : ""}
                        </Text>
                    ))}
                </Group>
            </Flex>
            <Center>
                <div className={classes.buttonGroup}>
                    <ActionIcon onClick={handleClick("decrement")}>
                        <TbMinus />
                    </ActionIcon>
                    <NumberInput
                        id={`addon-${id}`}
                        min={0}
                        max={10}
                        value={value}
                        onChange={handleChange}
                        variant="unstyled"
                        autoComplete={"off"}
                        classNames={{ input: classes.input }}
                    />
                    <ActionIcon onClick={handleClick("increment")}>
                        <TbPlus />
                    </ActionIcon>
                </div>
            </Center>
        </Paper>
    );
};
