import properties from "./property.json"
import {Col, Row} from "react-bootstrap"

export function Dashboard() {
    return (
        <>
          <h1>Dashboard</h1>
          <Row md={2} xs={1} lg={3} className="g-3">
            {properties.map(properties => (
              <Col key={properties.id}>
                <properties {...properties} />
              </Col>
            ))}
          </Row>
        </>
      )
    }