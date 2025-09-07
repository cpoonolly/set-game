import React from 'react';
import { Card } from './types';

interface ShapeProps {
    card: Card;
    strokeColor: string;
    fillColor: string;
    isStriped: boolean;
    shape: "Oval" | "Diamond" | "Rectangle";
    width?: number;
    height?: number;
}

const Shape: React.FC<ShapeProps> = ({
    card,
    strokeColor,
    fillColor,
    isStriped,
    shape,
    width = 50,
    height = 100,
}) => {
    const shapes = [
        {
            name: "Oval",
            element: <ellipse cx="25" cy="50" rx="18" ry="35" fill={isStriped ? `url(#${card}_stripes)` : fillColor} stroke={strokeColor} strokeWidth="5"/>
        },
        {
            name: "Diamond", 
            element: <polygon points="25,10 40,50 25,90 10,50" fill={isStriped ? `url(#${card}_stripes)` : fillColor} stroke={strokeColor} strokeWidth="5"/>
        },
        {
            name: "Rectangle",
            element: <rect x="10" y="15" width="30" height="70" fill={isStriped ? `url(#${card}_stripes)` : fillColor} stroke={strokeColor} strokeWidth="5"/>
        }
    ];
    
    // Find the current shape based on the shape prop
    const currentShape = shapes.findIndex(s => s.name === shape);
    const selectedShape = currentShape !== -1 ? shapes[currentShape] : shapes[0]; // fallback to first shape
    
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 50 100" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id={`${card}_stripes`} patternUnits="userSpaceOnUse" width="10" height="10">
                    <rect width="10" height="10" fill="white"/>
                    <rect width="10" height="5" fill={fillColor}/>
                </pattern>
            </defs>
            {selectedShape.element}
        </svg>
    );
}

export default Shape;