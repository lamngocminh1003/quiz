import React, { useRef, useState, useEffect } from "react";
import { Button, Typography, Popper, Paper, Box, Tooltip } from "@mui/material";

export const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
        setShowFullCell(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: "center",
        lineHeight: "24px",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: "100%",
          width,
          display: "block",
          position: "absolute",
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textTransform: "none", // Giữ nguyên kiểu chữ thường
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

export function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value || ""}
      width={params.colDef.computedWidth}
    />
  );
}
function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

export const TruncatedButton = ({
  content,
  cellStyle,
  cellBackgroundColor,
  cellTextColor,
  textStyle,
  handleEdit,
  row,
  field,
}) => {
  return (
    <Tooltip title={content}>
      <Button
        size="small"
        style={{ ...cellStyle, backgroundColor: cellBackgroundColor }}
        onClick={() => handleEdit({ row, field })}
      >
        <Typography
          color={cellTextColor}
          style={{
            ...textStyle,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "none", // Giữ nguyên kiểu chữ thường
          }}
        >
          {content}
        </Typography>
      </Button>
    </Tooltip>
  );
};
export const TruncatedTypo = ({ content, cellTextColor, textStyle }) => {
  return (
    <Tooltip title={content}>
      <Typography
        color={cellTextColor}
        style={{
          ...textStyle,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textTransform: "none", // Giữ nguyên kiểu chữ thường
        }}
      >
        {content}
      </Typography>
    </Tooltip>
  );
};
export const cellStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
};
export const iconStyle = {
  fontSize: "12px",
  marginRight: "5px",
};
export const textStyle = {
  fontSize: "12px",
};
export const textStyleJoinMode = {
  fontSize: "12px",
  textTransform: "capitalize",
};
