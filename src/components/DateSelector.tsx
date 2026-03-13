import React, {useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import {theme} from '../theme';
import {Block} from './Block';
import {Typography} from './Typography';

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector = ({date, onDateChange}: DateSelectorProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const changeDay = (offset: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);
    onDateChange(newDate);
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <Block
      row
      between
      center
      color={theme.colors.surface}
      p={1.5}
      radius="base"
      shadow="light"
      mh="layout"
      mb={2}>
      <TouchableOpacity
        onPress={() => changeDay(-1)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <ChevronLeft size={24} color={theme.colors.primary[600]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => setShowPicker(true)}>
        <CalendarIcon
          size={18}
          color={theme.colors.text.secondary}
          style={{marginRight: 8}}
        />
        <Block>
          <Typography variant="bodyBold">
            {isToday ? 'Hoje' : date.toLocaleDateString('pt-BR')}
          </Typography>
          <Typography variant="caption" color={theme.colors.text.light}>
            Alterar data
          </Typography>
        </Block>
      </TouchableOpacity>

      <Block width={24}>
        {!isToday && (
          <TouchableOpacity
            onPress={() => changeDay(1)}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <ChevronRight size={24} color={theme.colors.primary[600]} />
          </TouchableOpacity>
        )}
      </Block>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </Block>
  );
};
