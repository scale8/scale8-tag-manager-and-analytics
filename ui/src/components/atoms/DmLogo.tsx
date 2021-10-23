import { CSSProperties, FC, useCallback } from 'react';
import { LogoProps } from './Logo';

const DmLogo: FC<LogoProps> = (props: LogoProps) => {
    const buildStyle = useCallback<() => CSSProperties>(
        () => ({
            fill: '#ff0084',
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
        }),
        [],
    );

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 29.048809 38.791412"
                {...{
                    width: props.width,
                    height: props.height,
                }}
            >
                <path
                    d="M 19.3737 0.04557 C 24.7172 0.04557 29.0489 4.37731 29.0489 9.72085 L 19.3737 9.72085 Z"
                    style={buildStyle()}
                    id="path176"
                />
                <path
                    d="M 29.0479 29.1161 C 29.0479 34.4597 24.7161 38.7914 19.3726 38.7914 L 19.3726 29.1161 Z"
                    style={buildStyle()}
                    id="path180"
                />
                <path
                    d="M 19.362 9.67425 L 29.0479 9.67425 L 29.0479 19.3961 L 19.362 19.3961 Z"
                    style={buildStyle()}
                    id="path182"
                />
                <path
                    d="M 9.6751 6e-05 L 19.362 6e-05 L 19.362 9.72185 L 9.6751 9.72185 Z"
                    style={buildStyle()}
                    id="path184"
                />
                <path
                    d="M -0.0001 6e-05 L 9.6868 6e-05 L 9.6868 9.72185 L -0.0001 9.72185 Z"
                    style={buildStyle()}
                    id="path186"
                />
                <path
                    d="M 19.362 19.396 L 29.0479 19.396 L 29.0479 29.1168 L 19.362 29.1168 Z"
                    style={buildStyle()}
                    id="path188"
                />
                <path
                    d="M 9.6868 29.0703 L 19.3726 29.0703 L 19.3726 38.7911 L 9.6868 38.7911 Z"
                    style={buildStyle()}
                    id="path190"
                />
                <path
                    d="M -0.0001 29.0703 L 9.6868 29.0703 L 9.6868 38.7911 L -0.0001 38.7911 Z"
                    style={buildStyle()}
                    id="path192"
                />
                <path
                    d="M -0.0001 19.3496 L 9.6868 19.3496 L 9.6868 29.0714 L -0.0001 29.0714 Z"
                    style={buildStyle()}
                    id="path194"
                />
                <path
                    d="M -0.0001 9.62875 L 9.6868 9.62875 L 9.6868 19.3496 L -0.0001 19.3496 Z"
                    style={buildStyle()}
                    id="path196"
                />
            </svg>
        </>
    );
};

export default DmLogo;
