import React, { useState } from 'react';

function LineDrawer() {
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 });

    const handleMouseDown = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (draggingIndex === null) {
            setIsDrawing(true);
            setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
        }
    };

    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (isDrawing) {
            const dx = Math.abs(x - currentLine.x1);
            const dy = Math.abs(y - currentLine.y1);

            // Restrict the line to be either horizontal or vertical
            if (dx > dy) {
                setCurrentLine((prev) => ({ ...prev, x2: x, y2: prev.y1 }));
            } else {
                setCurrentLine((prev) => ({ ...prev, x2: prev.x1, y2: y }));
            }
        }

        if (draggingIndex !== null) {
            const x = e.clientX;
            const y = e.clientY;

            setLines((prevLines) =>
                prevLines.map((line, index) =>
                    index === draggingIndex
                        ? {
                            x1: x - dragOffset.dx,
                            y1: y - dragOffset.dy,
                            x2: x - dragOffset.dx + (line.x2 - line.x1),
                            y2: y - dragOffset.dy + (line.y2 - line.y1),
                        }
                        : line
                )
            );
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setLines((prevLines) => [...prevLines, currentLine]);
            setIsDrawing(false);
            setCurrentLine(null);
        }
        setDraggingIndex(null);
    };

    const startDragging = (e, index) => {
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY;
        const line = lines[index];

        setDragOffset({ dx: x - line.x1, dy: y - line.y1 });
        setDraggingIndex(index);
    };

    // Handle clicking on a node to start a new line from it
    const handleNodeClick = (e, x, y) => {
        e.stopPropagation();
        setIsDrawing(true);
        setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
    };

    return (
        <>
            <h1>Line Drawer with Nodes</h1>
            <br />
            <svg
                width="500"
                height="500"
                style={{ background: '#f0f0f0', cursor: 'crosshair', border: "3px solid black" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {lines.map((line, index) => (
                    <g key={index}>
                        {/* Line */}
                        <line
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                            stroke="black"
                            strokeWidth="2"
                            onMouseDown={(e) => startDragging(e, index)}
                            style={{ cursor: 'move' }}
                        />
                        {/* Start Node */}
                        <circle
                            cx={line.x1}
                            cy={line.y1}
                            r="5"
                            fill="red"
                            onMouseDown={(e) => handleNodeClick(e, line.x1, line.y1)}
                            // style={{ cursor: 'pointer' }}
                        />
                        {/* End Node */}
                        <circle
                            cx={line.x2}
                            cy={line.y2}
                            r="5"
                            fill="red"
                            onMouseDown={(e) => handleNodeClick(e, line.x2, line.y2)}
                            // style={{ cursor: 'pointer' }}
                        />
                    </g>
                ))}
                {isDrawing && currentLine && (
                    <line
                        x1={currentLine.x1}
                        y1={currentLine.y1}
                        x2={currentLine.x2}
                        y2={currentLine.y2}
                        stroke="black"
                        strokeWidth="2"
                    />
                )}
            </svg>
        </>
    );
}

export default LineDrawer;
