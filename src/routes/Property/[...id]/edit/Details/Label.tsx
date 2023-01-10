import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { EditPropertyContext } from "../components/Provider";

export const Label: FC = () => {
    const { property, dispatch } = useContext(EditPropertyContext);
    const [label, setLabel] = useState(property!.label);

    const [labelDebounced] = useDebouncedValue(label, 1000);

    useEffect(() => {
        if (property) {
            if (labelDebounced.length > 0 && labelDebounced != property.label) {
                dispatch({
                    type: "details",
                    payload: {
                        icon: property.icon,
                        label: labelDebounced,
                        description: property.description,
                        images: property.images
                    }
                });
            }
        }
    }, [labelDebounced]);

    useEffect(() => {
        if (property && property.label != label) setLabel(property.label);
    }, [property]);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };

    return (
        <TextInput
            size={"sm"}
            variant={"default"}
            value={label}
            onChange={handleLabelChange}
            error={label.length == 0 && "Property Label cannot be empty"}
        />
    );
};
