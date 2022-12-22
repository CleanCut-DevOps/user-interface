import { Button, Card } from "react-bootstrap"

type StorePropertyProps = {
    id:number,
    name:string,
    price:string,
    imgUrl: string,
}

export function StoreProperty( {id, name, price, imgUrl}: 
    StorePropertyProps) {
        const quantity = 0
    return <Card className="h-100">
        <Card.Img variant="top" src={imgUrl}  height="200px"  

        />
        <Card.Body className="d-flex flex-column">
        <Card.Title  className="d-flex justify-content-between align-items-baseline mb-4">
          <span className="fs-2">{name}</span>
          <span className="ms-2">{price}</span>
        </Card.Title>
       <div className="mt-auto">

        {quantity === 0  ? ( <Button className="w-100"> + Add to cart</Button>

        ): <div
        className="d-flex align-items-center flex-column"
        style={{ gap: ".5rem" }}>
             <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: ".5rem" }}>
                    <Button>-</Button>
                    <div>
                    <span className="fs-3">{quantity}</span> in cart
                    </div>
                    <Button>+</Button>
                </div>
                <Button>Remove</Button>
        </div>}
        </div>
        </Card.Body>
    </Card>
    }