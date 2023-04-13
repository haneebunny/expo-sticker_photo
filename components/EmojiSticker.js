import { View, Image } from 'react-native'
import { PanGestureHandler, PinchGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function EmojiSticker({ imageSize, stickerSource }) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scaleImage = useSharedValue(imageSize);
    // const baseScale = Animated.Value(1);
    // const pinchScale = Animated.Value(1);
    // const scale = Animated.multiply(baseScale, pinchScale);
    // const lastScale = 1;
    // const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: pinchScale } },
    // { useNativeDriver: USE_NATIVE_DRIVER }]);


    const onDoubleTap = useAnimatedGestureHandler({
        onActive: () => {
            if (scaleImage.value) {
                scaleImage.value = scaleImage.value * 1.5;
            }
        },
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        };
    });

    const onDrag = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.translateX;
            translateY.value = event.translationY + context.translateY;
        },
    });
    // onStart() : 제스처가 시작되거나 초기 위치에 있을 때
    // onActive() : 제스처가 활성화되어 있고 움직이는 경우 

    // const onPinch = useAnimatedGestureHandler({
    //     onActive: (event) => {
    //         // if (scaleImage.value) {
    //         //     scaleImage.value = event.translationX + event.translationY;
    //         // }
    //     }
    // })

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });


    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            {/* <PinchGestureHandler onGestureEvent={onPinch}> */}

            <AnimatedView style={[containerStyle, { top: -350 }]}>
                <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                    <AnimatedImage
                        source={stickerSource}
                        style={[imageStyle, { width: imageSize, height: imageSize, transform: [{ scale: 1 }] }]}
                        resizeMode='contain'
                    />
                </TapGestureHandler>
            </AnimatedView>
            {/* </PinchGestureHandler> */}
        </PanGestureHandler>
    );
}