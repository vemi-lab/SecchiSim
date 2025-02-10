import { Dimensions } from "react-native";
const {width, height} = Dimensions.get('window');

export const COLORS = {
    light_purple: "#6F73B3",
    light_green: '#99C3B6',
    dark_purple: '#6F73B3',
    dark_green: '#027759',
    
    correct: '#99C3B7',
    error: '#D95443',

    black: "#171717",
    white: "#FFFFFF",
    //background: "#252C4A"
}


export const SIZES = {
    base: 10,
    width,
    height
}