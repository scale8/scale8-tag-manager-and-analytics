import { createTheme, adaptV4Theme } from '@mui/material/styles';
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
const theme = createTheme(
    adaptV4Theme({
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
        overrides: {
            MuiTableCell: {
                head: {
                    fontWeight: 600,
                },
            },
            MuiSvgIcon: {
                root: {
                    fontSize: '1.25rem',
                },
            },
            MuiButton: {
                root: {
                    fontWeight: 600,
                },
            },
            MuiTooltip: {
                tooltip: {
                    fontSize: '.8rem',
                },
            },
            MuiDialogActions: {
                spacing: {
                    '& > :not(:first-child)': {
                        marginLeft: '16px',
                    },
                },
            },
        },
    }),
);

export default theme;
