import { FC } from 'react';
import { LogoProps } from './Logo';

const TmLogo: FC<LogoProps> = (props: LogoProps) => {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 29.036954 38.838082"
                {...{
                    width: props.width,
                    height: props.height,
                }}
            >
                <path
                    d="M 0 9.721 C 0 4.3775 4.332 0.0458 9.675 0.0458 L 9.675 9.721 Z"
                    style={{
                        fill: '#39cce0',
                        fillOpacity: 1,
                        fillRule: 'nonzero',
                        stroke: 'none',
                    }}
                    id="path158"
                />
                <path
                    d="M 29.037 0.0468 C 29.037 5.3903 24.705 9.7221 19.361 9.7221 L 19.361 0.0468 Z"
                    style={{
                        fill: '#39cce0',
                        fillOpacity: 1,
                        fillRule: 'nonzero',
                        stroke: 'none',
                    }}
                    id="path162"
                />
                <path
                    d="M 19.361 29.1625 C 19.361 34.506 15.029 38.8378 9.686 38.8378 L 9.686 29.1625 Z"
                    style={{
                        fill: '#39cce0',
                        fillOpacity: 1,
                        fillRule: 'nonzero',
                        stroke: 'none',
                    }}
                    id="path166"
                />
                <path
                    d="M 9.675 0.0002 L 19.361 0.0002 L 19.361 9.7221 L 9.675 9.7221 Z"
                    style={{
                        fill: '#39cce0',
                        fillOpacity: 1,
                        fillRule: 'nonzero',
                        stroke: 'none',
                    }}
                    id="path168"
                />
                <path
                    d="M 9.675 9.721 L 19.361 9.721 L 19.361 19.4418 L 9.675 19.4418 Z"
                    style={{
                        fill: '#39cce0',
                        fillOpacity: 1,
                        fillRule: 'nonzero',
                        stroke: 'none',
                    }}
                    id="path170"
                />
                <path
                    d="M 9.675 19.4418 L 19.361 19.4418 L 19.361 29.1636 L 9.675 29.1636 Z"
                    style={{
                        fill: '#39cce0',
                        fillOpacity: 1,
                        fillRule: 'nonzero',
                        stroke: 'none',
                    }}
                    id="path172"
                />
            </svg>
        </>
    );
};

export default TmLogo;
