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
  Pressable
} from 'react-native';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';





export interface DropdownItem {
  id: string;
  name: string;
  access?: string;
}



interface CustomDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  onSelect?: (item: DropdownItem) => void;
  style?: any;
  placeholderStyle?: any;


  selectedTextStyle?: any;
  inputSearchStyle?: any;
  itemTextStyle?: any;
  itemContainerStyle?: any;
  containerStyle?: any;
  searchPlaceholderTextColor?: string;
  maxHeight?: number;
}

export const DropdownComponent = ({
  data,
  placeholder = 'Select item',
  searchPlaceholder = 'Search...',
  onSelect,



  maxHeight = 225,

}: CustomDropdownProps) => {
  const { theme } = useTheme();
  const themeStyles = getThemeStyles(theme);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const DropdownButtonRef = useRef<View>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setFilteredData(data);
  }, [data]);

  const measureDropdown = () => {

    DropdownButtonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({ x, y, width, height });
    });
  };


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

  const onItemPress = useCallback((item: DropdownItem) => {
    setValue(item.id);
    setVisible(false);
    setIsFocus(false);
    onSelect?.(item);
  }, [onSelect]);


  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data]);

  const selectedItem = data.length > 0 ? data.find(item => item.id === value) : null;



  const renderItem = ({ item }: { item: DropdownItem }) => (
    <Pressable
      style={[styles.item]}
      onPress={() => onItemPress(item)}
    >
      <Text style={[styles.itemText, themeStyles.text]}>{item.name}</Text>
    </Pressable>
  );


  const renderDropdown = () => {
    const { height: windowHeight } = Dimensions.get('window');
    const statusBarHeight = StatusBar.currentHeight || 0;
    const bottomSpace = windowHeight - position.y - position.height - statusBarHeight;
    const showOnTop = bottomSpace < maxHeight;

    const modalStyle = {
      top: showOnTop ? undefined : position.y + position.height,
      bottom: showOnTop ? windowHeight - position.y : undefined,
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
                style={[styles.list, { maxHeight }]}
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

          {selectedItem ? selectedItem.name : placeholder}
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