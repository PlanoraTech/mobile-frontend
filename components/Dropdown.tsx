import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownData } from '@/types';
import { useTheme } from '@/contexts/ThemeProvider';
import { getThemeStyles } from '@/assets/styles/themes';

interface DropdownProps {
  data: DropdownData[];
  placeholder: string;
  searchPlaceholder: string;
  label: string;
  onSelect: (item: any) => void;
  customStyles?: any;
  customPlaceholderStyle?: any,
  customInputSearchStyle?: any,
  customSelectedTextStyle?: any
  customItemTextStyle?: any
  dropDirection?: 'auto' | 'top' | 'bottom';
}

const DropdownComponent = ({
  data,
  placeholder = 'Válassz elemet',
  searchPlaceholder = 'Keresés...',
  label,
  onSelect,
  customStyles,
  customPlaceholderStyle,
  customSelectedTextStyle,
  customInputSearchStyle,
  customItemTextStyle,
  dropDirection
}: DropdownProps) => {
  const { theme } = useTheme();
  const themeStyle = getThemeStyles(theme);
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>

        </Text>
      );
    }
    return null;
  };
  return (
    <View style={[styles.container, themeStyle.content]}>
      {renderLabel()}
      <Dropdown

        style={[themeStyle.content, styles.dropdown, isFocus && { borderColor: themeStyle.text.color }]}
        placeholderStyle={[styles.placeholderStyle, themeStyle.text]}
        selectedTextStyle={[styles.selectedTextStyle, themeStyle.text]}
        inputSearchStyle={[styles.inputSearchStyle, themeStyle.text]}
        itemTextStyle={[styles.itemTextStyle, themeStyle.text]}
        itemContainerStyle={[styles.itemContainerStyle, themeStyle.content]}
        containerStyle={[styles.listContainer, themeStyle.content]}
        searchPlaceholderTextColor={themeStyle.secondaryText.color}
        data={data}
        search
        maxHeight={225}
        labelField="name"
        valueField="id"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        dropdownPosition={dropDirection || 'auto'}
        showsVerticalScrollIndicator={false}
        onChange={item => {
          setValue(item.id);
          setIsFocus(false);
          if (onSelect) {
            onSelect(item);
          }
        }}
        renderLeftIcon={() => null}
        renderRightIcon={() => null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  listContainer: {
    borderRadius: 8,
    borderWidth: 0,
    paddingHorizontal: 4
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: 'grey',

  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 999,
    marginHorizontal: 'auto',
    paddingHorizontal: 8,
    fontSize: 14,

  },
  placeholderStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  itemContainerStyle: {
    alignItems: 'center',

  },
  itemTextStyle: {
    fontSize: 16,
  },
});

export default DropdownComponent;