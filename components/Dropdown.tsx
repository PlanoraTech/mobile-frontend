import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Pressable,
  Keyboard
} from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';

export interface DropdownItem {
  id: string;
  name: string;
  access?: string;
  isSubstituted?: boolean;
}



interface CustomDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  onSelect?: (item: DropdownItem) => void;
  maxHeight?: number;
}

export const DropdownComponent = ({
  data,
  placeholder = 'Válassz...',
  searchPlaceholder = 'Keresés...',
  onSelect,
  maxHeight = 180,

}: CustomDropdownProps) => {
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const DropdownButtonRef = useRef<View>(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const measureDropdown = () => {

    DropdownButtonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({ x, y, width, height });
    });
  };


  useEffect(() => {
    function onKeyboardDidShow() {
      measureDropdown();
    }

    function onKeyboardDidHide() {
      measureDropdown();
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);




  const toggleDropdown = useCallback(() => {

    measureDropdown();
    setVisible(!visible);
    if (!visible) {



      setIsFocus(true);
      setSearchText('');
      setFilteredData(data);
    } else {
      setIsFocus(false);
    }
  }, [visible, data]);

  const onItemPress = (item: DropdownItem) => {
    //setValue(item.id);
    setVisible(false);
    setIsFocus(false);
    onSelect?.(item);
  };


  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data]);




  const renderItem = ({ item }: { item: DropdownItem }) => (
    <Pressable
      style={[styles.item]}
      onPress={() => onItemPress(item)}
    >
      <Text style={[styles.itemText, themeStyles.text]}>{item.name}</Text>
    </Pressable>
  );


  const renderDropdown = () => {

    const modalStyle = {
      top: position.y + position.height,
      left: position.x,
      width: position.width,
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType='none'
        onRequestClose={toggleDropdown}
      >

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
          style={styles.overlay}
        >
          <KeyboardAvoidingView

            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
          >

            <View style={[styles.dropdown, modalStyle, themeStyles.content]}>
              <TextInput
                style={[styles.searchInput, themeStyles.text]}
                placeholder={searchPlaceholder}
                placeholderTextColor={themeStyles.text.color}
                value={searchText}
                onChangeText={handleSearch}
              />

              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                style={[styles.list, { maxHeight: maxHeight }]}
              />
            </View>
          </KeyboardAvoidingView>

        </Pressable>



      </Modal>
    );
  };


  return (
    <View style={[styles.container]}>
      <Pressable

        ref={DropdownButtonRef}
        onPress={toggleDropdown}

        style={[
          styles.button,
          isFocus && { borderColor: themeStyles.text.color }
        ]}
      >

        <Text
          style={[
            styles.buttonText,
            themeStyles.text
          ]}
        >

          {placeholder}
        </Text>
      </Pressable>
      {visible && renderDropdown()}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: 'grey',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  list: {
    borderRadius: 8,
  },
  item: {
    padding: 12,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
});

export default DropdownComponent;