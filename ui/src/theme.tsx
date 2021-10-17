import { createTheme } from '@mui/material/styles';
import { getProductSection, ProductSectionKey } from './containers/SectionsDetails';
import { grey } from '@mui/material/colors';

declare module '@mui/material/styles/createPalette' {
    interface Palette {
        adminColor: Palette['primary'];
        dataManagerColor: Palette['primary'];
        tagManagerColor: Palette['primary'];
        commonColor: Palette['primary'];
    }
    interface PaletteOptions {
        adminColor: PaletteOptions['primary'];
        dataManagerColor: PaletteOptions['primary'];
        tagManagerColor: PaletteOptions['primary'];
        commonColor: PaletteOptions['primary'];
    }
}

// A custom theme for this app
const theme = createTheme({
    palette: {
        primary: {
            main: '#25302e',
        },
        secondary: {
            main: grey['700'],
        },
        error: {
            main: '#c63d51',
        },
        info: {
            main: '#444444',
        },
        success: {
            main: '#c6e54b',
        },
        background: {
            default: '#ffffff',
        },
        adminColor: {
            main: getProductSection(ProductSectionKey.admin).color,
        },
        dataManagerColor: {
            main: getProductSection(ProductSectionKey.dataManager).color,
        },
        tagManagerColor: {
            main: getProductSection(ProductSectionKey.tagManager).color,
        },
        commonColor: {
            main: getProductSection(ProductSectionKey.global).color,
        },
    },
    typography: {
        fontFamily: ['Source Sans Pro', 'Helvetica Neue', 'Arial', 'sans-serif'].join(','),
        fontSize: 14,
        body1: {
            fontSize: 14,
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '.8rem',
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                spacing: {
                    '& > :not(:first-child)': {
                        marginLeft: '16px',
                    },
                },
            },
        },
    },
});

export default theme;
