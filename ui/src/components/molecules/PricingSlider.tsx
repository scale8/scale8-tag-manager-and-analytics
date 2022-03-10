import { Box, Slider } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';
import { styled } from '@mui/material/styles';

const PriceSlider = styled(Slider)({
    height: 8,
    '& .MuiSlider-track': {
        height: 8,
        borderRadius: 4,
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: 'currentColor',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
    },
    '& .MuiSlider-rail': {
        color: '#333333',
        height: 8,
        borderRadius: 4,
    },
});

type HomePagePricingSliderProps = {
    question: string;
    adjustText: string;
    value: number;
    displayValue: string;
    setValue: Dispatch<SetStateAction<number>>;
    max: number;
    type: 'tag' | 'data';
};

export const PricingSlider: FC<HomePagePricingSliderProps> = (
    props: HomePagePricingSliderProps,
) => {
    const { setValue, value, question, adjustText, displayValue, max, type } = props;

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setValue(typeof newValue === 'number' ? newValue : 0);
    };

    return (
        <>
            <Box pb={1}>{question}</Box>
            <Box fontSize="20px" fontWeight={600} color="#434343">
                {displayValue}
            </Box>
            <Box width="100%" height="34px" px="5px">
                <PriceSlider
                    sx={{
                        color: (theme) =>
                            type === 'tag'
                                ? theme.palette.tagManagerColor.main
                                : theme.palette.dataManagerColor.main,
                    }}
                    value={value}
                    onChange={handleSliderChange}
                    valueLabelDisplay="off"
                    aria-label="price slider"
                    min={0}
                    max={max}
                    defaultValue={0}
                />
            </Box>
            <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                    '& svg': {
                        display: 'block',
                    },
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 11.750005 1.2519075"
                    width="50px"
                >
                    <g
                        id="g325"
                        transform="matrix(0.26458333,0,0,0.26458333,-60.672916,-69.083767)"
                    >
                        <path
                            stroke="#b7b7b7"
                            strokeWidth="1"
                            strokeLinejoin="round"
                            strokeLinecap="butt"
                            d="M 235.31496,263.46982 H 267.7244"
                            fillRule="evenodd"
                            id="path302"
                        />
                        <path
                            fill="#b7b7b7"
                            stroke="#b7b7b7"
                            strokeWidth="1"
                            strokeLinecap="butt"
                            d="m 235.31496,261.81808 -4.5381,1.65173 4.5381,1.65174 z"
                            fillRule="evenodd"
                            id="path304"
                        />
                        <path
                            fill="#b7b7b7"
                            stroke="#b7b7b7"
                            strokeWidth="1"
                            strokeLinecap="butt"
                            d="m 267.7244,265.12155 4.53812,-1.65173 -4.53812,-1.65174 z"
                            fillRule="evenodd"
                            id="path306"
                        />
                    </g>
                </svg>
                <Box color="#333333" pt="5px">
                    <small>{adjustText}</small>
                </Box>
            </Box>
        </>
    );
};
