import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

interface GradientBackgroundProps extends ViewProps {
    colors: string[];
    children?: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ colors, children, style, ...props }) => {
    return (
        <View style={[styles.container, style]} {...props}>
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        {colors.map((color, index) => (
                            <Stop
                                key={index}
                                offset={`${(index / (colors.length - 1)) * 100}%`}
                                stopColor={color}
                            />
                        ))}
                    </SvgLinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            </Svg>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientBackground;
