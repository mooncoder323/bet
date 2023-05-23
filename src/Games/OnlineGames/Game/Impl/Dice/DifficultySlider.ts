import {Slider, styled} from "@mui/material";

export const DifficultySliderReverse = styled(Slider)(({ theme }) => ({
    color: 'rgba(0, 228, 73, .5)',
    height: '10',
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 35,
        width: 35,
        color: 'rgb(214, 214, 214)',
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
        },
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-track': {
        height: 10,
    },
    '& .MuiSlider-markLabel': {
        marginLeft: '25px',
        marginTop: '-25px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    '& .MuiSlider-markLabelActive': {
        marginLeft: '-25px',
        marginTop: '-25px'
    },
    '& .MuiSlider-rail': {
        color: theme.palette.mode === 'dark' ? 'rgba(241, 2, 96, .8)' : 'rgba(241, 2, 96, .8)',
        opacity: theme.palette.mode === 'dark' ? undefined : 1,
        height: 10,
    },
}));

export const DifficultySlider = styled(Slider)(({ theme }) => ({
    color: 'rgba(241, 2, 96, .8)',
    height: '10',
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 35,
        width: 35,
        color: 'rgb(214, 214, 214)',
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
        },
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-track': {
        height: 10,
    },
    '& .MuiSlider-markLabel': {
        marginLeft: '25px',
        marginTop: '-25px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    '& .MuiSlider-markLabelActive': {
        marginLeft: '-25px',
        marginTop: '-25px'
    },
    '& .MuiSlider-rail': {
        color: theme.palette.mode === 'dark' ? 'rgba(0, 228, 73, .5)' : 'rgba(0, 228, 73, .8)',
        opacity: theme.palette.mode === 'dark' ? undefined : 1,
        height: 10,
    },
}));

export const RollSlider = styled(Slider)(({ theme }) => ({
    color: 'rgba(0, 228, 73, .8)',
    height: '10',
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        width: 65,
        color: 'rgb(214, 214, 214)',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0px !important',
        boxShadow: 'none',
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-track': {
        height: 10,
    },
    '&.Mui-disabled': {
        color: 'rgba(0, 228, 73, .8)',
    },
    '& .MuiSlider-markLabel': {
        marginLeft: '25px',
        marginTop: '-25px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    '& .MuiSlider-markLabelActive': {
        marginLeft: '-25px',
        marginTop: '-25px'
    },
    '& .MuiSlider-rail': {
        color: theme.palette.mode === 'dark' ? 'rgba(0, 228, 73, .5)' : 'rgba(0, 228, 73, .8)',
        opacity: theme.palette.mode === 'dark' ? undefined : 1,
        height: 10,
    },
}));

export const RollSliderLost = styled(Slider)(({ theme }) => ({
    color: 'rgba(241, 2, 96, .8)',
    height: '10',
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        width: 65,
        color: 'rgb(214, 214, 214)',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0px !important',
        boxShadow: 'none',
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
    '& .MuiSlider-track': {
        height: 10,
    },
    '&.Mui-disabled': {
        color: 'rgba(241, 2, 96, .8)',
    },
    '& .MuiSlider-markLabel': {
        marginLeft: '25px',
        marginTop: '-25px',
        color: 'rgba(255, 255, 255, 0.6)'
    },
    '& .MuiSlider-markLabelActive': {
        marginLeft: '-25px',
        marginTop: '-25px'
    },
    '& .MuiSlider-rail': {
        color: theme.palette.mode === 'dark' ? 'rgba(241, 2, 96, .8)' : 'rgba(241, 2, 96, .8)',
        opacity: theme.palette.mode === 'dark' ? undefined : 1,
        height: 10,
    },
}));