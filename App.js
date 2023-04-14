import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import domtoimage from 'dom-to-image';
import "react-native-gesture-handler";


// components
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

// Image
const PlaceholderImage = require('./assets/images/paduck.jpg')

export default function App() {
  const imageRef = useRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [pickedEmojis, setPickedEmojis] = useState([]);

  const [status, requestPermission] = MediaLibrary.usePermissions();



  // reset 버튼을 누르면 처음으로 이동, 붙였던 이모지는 사라진다.
  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(null)
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {


    // 웹이 아니면(어플이면) 
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('저장했다!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then(dataUrl => {
          let link = document.createElement('a');
          link.download = '스티커_사진.jpeg';
          link.href = dataUrl;
          link.click();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);

    } else {
      alert('이미지를 선택해달라.');
    }
  };

  if (status === null) {
    requestPermission();
  }



  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.phoneContainer}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmojis?.map((emoji) => (
              <EmojiSticker imageSize={40} stickerSource={emoji} />
            ))
            }
            {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}

          </View>
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>) : (
          <View style={styles.footerContainer}>
            <Button theme="primary" label="사진 고르기" onPress={pickImageAsync} />
            <Button label="이 사진으로!" onPress={() => setShowAppOptions(true)} />
            <Button label="지도로" onPress={() => setShowAppOptions(true)} />
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmojis} onCloseModal={onModalClose} pickedEmojis={pickedEmojis} />
        </EmojiPicker>

        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5d867b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: '#486548'
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
    gap: 10,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});