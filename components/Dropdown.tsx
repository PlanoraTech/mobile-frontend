import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { DropdownData } from '@/types';

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
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown

        style={[customStyles, styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={customPlaceholderStyle || styles.placeholderStyle}
        selectedTextStyle={customSelectedTextStyle || styles.selectedTextStyle}
        inputSearchStyle={customInputSearchStyle || styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={customItemTextStyle}
        itemContainerStyle={styles.itemContainerStyle}
        containerStyle={styles.listContainer}

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
    backgroundColor: 'white',
    padding: 16,
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 0.5,
    paddingHorizontal: 4
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,

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
    textAlign: 'center'
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign: 'center'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemContainerStyle: {
    alignItems: 'center',
  },
});

export default DropdownComponent;