import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

interface IProps {
  image: string;
  price: number;
  name: string;
  category: string;
  level: string;
}

const CardDefault: React.FC<IProps> = ({
  image,
  price,
  name,
  category,
  level,
}) => {
  return (
    <Card className="mt-6 w-96">
      <CardHeader className="relative h-56">
        <img
          src={image}
          alt={`${name} image`} // Improved alt text for accessibility
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {name}
        </Typography>
        <Typography className="mb-2" color="gray">
          Level: {level}
        </Typography>
        <Typography className="mb-2" color="gray">
          Category: {category}
        </Typography>
        <Typography className="mb-2" color="green">
          Price: ${price.toFixed(2)} {/* Ensure price is formatted */}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button color="lightBlue">Read More</Button>
      </CardFooter>
    </Card>
  );
};

export default CardDefault; // Export the component
