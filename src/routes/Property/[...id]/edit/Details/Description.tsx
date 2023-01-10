import { Textarea } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { EditPropertyContext } from "../components/Provider";

export const Description: FC = () => {
    const { property, dispatch } = useContext(EditPropertyContext);
    const [description, setDescription] = useState(property!.description);

    const [descriptionDebounced] = useDebouncedValue(description, 1000);

    useEffect(() => {
        if (property && descriptionDebounced != property.description) {
            dispatch({
                type: "details",
                payload: {
                    icon: property.icon,
                    label: property.label,
                    description: descriptionDebounced,
                    images: property.images
                }
            });
        }
    }, [descriptionDebounced]);

    useEffect(() => {
        if (property && property.description != description) setDescription(property.description);
    }, [property]);

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value);

    return (
        <Textarea
            value={description ?? ""}
            variant={"default"}
            onChange={handleDescriptionChange}
            autosize
            minRows={2}
            maxRows={4}
        />
    );
};
