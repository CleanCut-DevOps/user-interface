import { Propertylist } from "./components/StoreProperty"
import storePropertys from "./property.json"
import {Col, Row} from "react-bootstrap"
import { createStyles, Paper } from "@mantine/core";
import { Booking } from "./components/Form";
import { FC } from "react";

const useStyles = createStyles(() => ({
  wrapper: {
      height: "100vh",
      padding: "1.5rem",
      display: "flex",
      gap: "1.5rem"
  }
}));

export const Dashboard: FC = () => {
  const { classes } = useStyles();
  return (
      <Paper className={classes.wrapper}>
        <Propertylist />
          <Booking />
          
          
      </Paper>
  );
};