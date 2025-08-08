import { useState } from "react";

interface ShapeProps {
    strokeColor: string;
    fillColor: string;
    isStriped: boolean;
    shape: "Oval" | "Diamond" | "Rectangle";
}

const Shape: React.FC<ShapeProps> = ({
    strokeColor,
    fillColor,
    isStriped,
    shape,
}) => {
    const shapes = [
        {
            name: "Oval",
            element: <ellipse cx="25" cy="50" rx="18" ry="35" fill={isStriped ? "url(#stripes)" : fillColor} stroke={strokeColor} strokeWidth="5"/>
        },
        {
            name: "Diamond", 
            element: <polygon points="25,10 40,50 25,90 10,50" fill={isStriped ? "url(#stripes)" : fillColor} stroke={strokeColor} strokeWidth="5"/>
        },
        {
            name: "Rectangle",
            element: <rect x="10" y="15" width="30" height="70" fill={isStriped ? "url(#stripes)" : fillColor} stroke={strokeColor} strokeWidth="5"/>
        }
    ];
    
    // Find the current shape based on the shape prop
    const currentShape = shapes.findIndex(s => s.name === shape);
    const selectedShape = currentShape !== -1 ? shapes[currentShape] : shapes[0]; // fallback to first shape
    
    return (
        <svg width="50" height="100" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="10">
                    <rect width="10" height="10" fill="white"/>
                    <rect width="10" height="5" fill={fillColor}/>
                </pattern>
            </defs>
            {selectedShape.element}
        </svg>
    );
}

export default Shape;