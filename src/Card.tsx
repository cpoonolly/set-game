import React from 'react';
import Shape from './Shape';
import { Card as CardType, Shape as ShapeEnum, Color, Fill, Count } from './types';
import { getCardProperties } from './utils';

interface CardProps {
    card: CardType;
    variant?: "normal" | "small";
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
    card, 
    variant = "normal", 
    className = '', 
    onClick 
}) => {
    const properties = getCardProperties(card);
    
    // Define size configurations
    const sizeConfig = {
        normal: {
            shapeWidth: 50,
            shapeHeight: 100,
            gap: '10px',
            padding: '10px'
        },
        small: {
            shapeWidth: 15,
            shapeHeight: 30,
            gap: '3px',
            padding: '3px'
        }
    };
    
    const currentSize = sizeConfig[variant];
    
    // Map enum values to Shape component props
    const getShapeType = (shape: ShapeEnum): "Oval" | "Diamond" | "Rectangle" => {
        switch (shape) {
            case ShapeEnum.RECTANGLE: return "Rectangle";
            case ShapeEnum.OVAL: return "Oval";
            case ShapeEnum.DIAMOND: return "Diamond";
        }
    };
    
    const getStrokeColor = (color: Color): string => {
        switch (color) {
            case Color.GREEN: return '#4CAF50';
            case Color.RED: return '#F44336';
            case Color.PURPLE: return '#9C27B0';
        }
    };
    
    const getFillColor = (color: Color, fill: Fill): string => {
        if (fill === Fill.EMPTY) {
            return 'white';
        }
        // For solid and striped, use the same base color
        switch (color) {
            case Color.GREEN: return '#4CAF50';
            case Color.RED: return '#F44336';
            case Color.PURPLE: return '#9C27B0';
        }
    };
    
    const getIsStriped = (fill: Fill): boolean => {
        return fill === Fill.STRIPED;
    };
    
    const getShapeCount = (count: Count): number => {
        switch (count) {
            case Count.ONE: return 1;
            case Count.TWO: return 2;
            case Count.THREE: return 3;
        }
    };
    
    const shapeType = getShapeType(properties.shape);
    const strokeColor = getStrokeColor(properties.color);
    const fillColor = getFillColor(properties.color, properties.fill);
    const isStriped = getIsStriped(properties.fill);
    const shapeCount = getShapeCount(properties.count);
    
    return (
        <div 
            className={`card ${className}`}
            onClick={onClick}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: currentSize.gap,
                padding: currentSize.padding,
                cursor: onClick ? 'pointer' : 'default'
            }}
        >
            {Array.from({ length: shapeCount }).map((_, index) => (
                <Shape
                    key={index}
                    card={card}
                    strokeColor={strokeColor}
                    fillColor={fillColor}
                    isStriped={isStriped}
                    shape={shapeType}
                    width={currentSize.shapeWidth}
                    height={currentSize.shapeHeight}
                />
            ))}
        </div>
    );
};

export default Card;