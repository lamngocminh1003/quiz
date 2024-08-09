import React from "react";
import TextComponent from "./TextComponent";
const TitleComponent = (props) => {
  const { text, size, font, color } = props;
  return (
    <TextComponent
      text={text}
      size={size ?? 24}
      font={font ?? fontFamilies.semiBold}
      color={color ?? colors.text}
    />
  );
};

export default TitleComponent;
