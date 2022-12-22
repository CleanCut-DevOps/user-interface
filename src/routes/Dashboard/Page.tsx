import { StoreProperty } from "./components/StoreProperty"
import storePropertys from "./property.json"
import {Col, Row} from "react-bootstrap"

export function Dashboard() {
    return (
        <>
          <h1>Dashboard</h1>
          <Row md={2} xs={1} lg={3} className="g-3">
            {storePropertys.map(property => (
              <Col key={property.id}>
                <StoreProperty{...property} />
              </Col>
            ))}
          </Row>
        </>
      )
    }