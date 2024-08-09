import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
export default function BasicCard(props) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography variant="h6" component="div" className="text-center">
          {props.title}
        </Typography>
        <Typography color="text.secondary" variant="h6" className="text-center">
          {props.majorCount}
        </Typography>
      </CardContent>
    </Card>
  );
}
