import { useEffect, useRef, useState } from "react";
import { Button , Stack } from "@mui/material";

const buttonStyles = {
    backgroundColor: "black",
    color: "white",
    "&:hover": { backgroundColor: "#333" },
};

const SvgToCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [shapes, setShapes] = useState([]); // Stores drawn shapes

    useEffect(() => {
        console.log("😊", shapes)
        redrawCanvas();
    }, [shapes]);

    const redrawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawExistingShapes(ctx);
    };

    // Store and redraw existing shapes
    const drawExistingShapes = (ctx) => {
        shapes.forEach((shape) => {
            if (shape.type === "line") {
                drawLine(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
            } else if (shape.type === "plus") {
                drawPlus(ctx, shape.x, shape.y);
            } else if (shape.type === "symbol") {
                drawSymbol(ctx, shape.x, shape.y);
            }
        });
    };

    // Draw temporary preview line while dragging
    const drawPreviewLine = (ctx, x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.setLineDash([5, 5]); // Dashed line for preview
        if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1); // Horizontal preview
        } else {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y2); // Vertical preview
        }
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
    };

    // Handle mouse down to start drawing
    const handleMouseDown = (e) => {
        if (!drawMode) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (drawMode === "line") {
            setStartPoint({ x, y });
            setIsDrawing(true);
        } else if (drawMode === "plus") {
            setShapes((prevShapes) => [...prevShapes, { type: "plus", x, y }]);
        } else if (drawMode === "symbol") {
            setShapes((prevShapes) => [...prevShapes, { type: "symbol", x, y }]);
        }
    };

    // Handle mouse move to show preview line
    const handleMouseMove = (e) => {
        if (!isDrawing || drawMode !== "line") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        redrawCanvas();
        drawPreviewLine(ctx, startPoint.x, startPoint.y, x, y);
    };

    // Handle mouse up to complete drawing
    const handleMouseUp = (e) => {
        if (!isDrawing || drawMode !== "line") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setShapes((prevShapes) => [...prevShapes, { type: "line", x1: startPoint.x, y1: startPoint.y, x2: x, y2: y },]);
        setIsDrawing(false);
        setStartPoint(null);
    };

    // Handle mouse click to draw elements
    const handleCanvasClick = (e) => {
        if (!drawMode) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;

        if (drawMode === "plus") {
            drawPlus(ctx, x, y);
        } else if (drawMode === "symbol") {
            drawSymbol(ctx, x, y);
        } else if (drawMode === "line") {
            if (!startPoint) {
                setStartPoint({ x, y });
            } else {
                drawLine(ctx, startPoint.x, startPoint.y, x, y);
                setStartPoint(null);
            }
        }
    };

    // Draw plus symbol
    const drawPlus = (ctx, x, y) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 40, y);
        ctx.moveTo(x + 20, y - 20);
        ctx.lineTo(x + 20, y + 20);
        ctx.stroke();
    };

    // Draw  transistor
    const drawSymbol = (ctx, x, y) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 40, y);
        ctx.arc(x + 20, y, 5, 0, Math.PI * 2);
        ctx.stroke();
    };

    // Draw straight horizontal or vertical line
    const drawLine = (ctx, x1, y1, x2, y2) => {
        ctx.beginPath();
        if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1); // Horizontal line
        } else {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y2); // Vertical line
        }
        ctx.stroke();
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px" }}>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => setDrawMode("line")} sx={buttonStyles} > Line </Button>
                <Button variant="contained" onClick={() => setDrawMode("plus")} sx={buttonStyles} > + </Button>
                <Button variant="contained" onClick={() => setDrawMode("symbol")} sx={buttonStyles}>Symbol </Button>
            </Stack>
            {/* Canvas for drawing */}
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{
                    border: "2px solid black",
                    marginTop: "20px",
                    cursor: isDrawing ? "crosshair" : "default",
                }}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />
        </div>
    );
};

export default SvgToCanvas;
