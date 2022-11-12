/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import BasicDay from "react-native-calendars/src/calendar/day/basic";
import Day, { DayProps } from "react-native-calendars/src/calendar/day/index";
import CalendarHeader, { CalendarHeaderProps } from "react-native-calendars/src/calendar/header";
import styleConstructor from "react-native-calendars/src/calendar/style";
import { extractDayProps, extractHeaderProps } from "react-native-calendars/src/componentUpdater";
import { isGTE, isLTE, page, sameMonth } from "react-native-calendars/src/dateutils";
import { getState } from "react-native-calendars/src/day-state-manager";
import { useDidUpdate } from "react-native-calendars/src/hooks";
import { parseDate as paseDateUntyped, toMarkingFormat, xdateToData } from "react-native-calendars/src/interface";
import { DateData, MarkedDates, Theme } from "react-native-calendars/src/types";
import XDate from "xdate";

const parseDate = paseDateUntyped as (date: Parameters<typeof paseDateUntyped>[0]) => XDate;

/*
The MIT License (MIT)

Copyright (c) 2017 Wix.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export interface CalendarProps extends CalendarHeaderProps, DayProps {
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
  firstDay?: number;
  /** Display loading indicator */
  displayLoadingIndicator?: boolean;
  /** Show week numbers */
  showWeekNumbers?: boolean;
  /** Specify style for calendar container element */
  style?: StyleProp<ViewStyle>;
  /** Initially visible month */
  current?: string; // TODO: migrate to 'initialDate'
  /** Initially visible month. If changed will initialize the calendar to this value */
  initialDate?: string;
  /** Minimum date that can be selected, dates before minDate will be grayed out */
  minDate?: string;
  /** Maximum date that can be selected, dates after maxDate will be grayed out */
  maxDate?: string;
  /** Collection of dates that have to be marked */
  markedDates?: MarkedDates;
  /** Do not show days of other months in month page */
  hideExtraDays?: boolean;
  /** Always show six weeks on each month (only when hideExtraDays = false) */
  showSixWeeks?: boolean;
  /** Handler which gets executed on day press */
  onDayPress?: (date: DateData) => void;
  /** Handler which gets executed on day long press */
  onDayLongPress?: (date: DateData) => void;
  /** Handler which gets executed when month changes in calendar */
  onMonthChange?: (date: DateData) => void;
  /** Handler which gets executed when visible month changes in calendar */
  onVisibleMonthsChange?: (months: DateData[]) => void;
  /** Disables changing month when click on days of other months (when hideExtraDays is false) */
  disableMonthChange?: boolean;
  /** Enable the option to swipe between months */
  // enableSwipeMonths?: boolean;
  /** Disable days by default */
  disabledByDefault?: boolean;
  /** Style passed to the header */
  headerStyle?: StyleProp<ViewStyle>;
  /** Allow rendering a totally custom header */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customHeader?: any;
  /** Allow selection of dates before minDate or after maxDate */
  allowSelectionOutOfRange?: boolean;
}

/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
const Calendar = (props: CalendarProps) => {
  const {
    initialDate,
    current,
    theme,
    markedDates,
    minDate,
    maxDate,
    allowSelectionOutOfRange,
    onDayPress,
    onDayLongPress,
    onMonthChange,
    onVisibleMonthsChange,
    disableMonthChange,
    // enableSwipeMonths,
    hideExtraDays,
    firstDay,
    showSixWeeks,
    displayLoadingIndicator,
    customHeader,
    headerStyle,
    accessibilityElementsHidden,
    importantForAccessibility,
    testID,
    style: propsStyle
  } = props;
  const [ currentMonth, setCurrentMonth ] = useState(current || initialDate ? parseDate(current ?? initialDate) : new XDate());
  const style = useRef(styleConstructor(theme));
  const header = useRef();
  const weekNumberMarking = useRef({ disabled: true, disableTouchEvent: true });

  useEffect(() => {
    if (initialDate) {
      setCurrentMonth(parseDate(initialDate));
    }
  }, [initialDate]);

  useDidUpdate(() => {
    const _currentMonth = currentMonth.clone();
    onMonthChange?.(xdateToData(_currentMonth));
    onVisibleMonthsChange?.([xdateToData(_currentMonth)]);
  }, [currentMonth]);

  const updateMonth = useCallback((newMonth: XDate) => {
    if (sameMonth(newMonth, currentMonth)) {
      return;
    }
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const addMonth = useCallback((count: number) => {
    const newMonth = currentMonth.clone().addMonths(count, true);
    updateMonth(newMonth);
  }, [ currentMonth, updateMonth ]);

  const handleDayInteraction = useCallback((date: DateData, interaction?: (date: DateData) => void) => {
    const day = new XDate(date.dateString);

    if (allowSelectionOutOfRange || !(minDate && !isGTE(day, new XDate(minDate))) && !(maxDate && !isLTE(day, new XDate(maxDate)))) {
      if (!disableMonthChange) {
        updateMonth(day);
      }
      if (interaction) {
        interaction(date);
      }
    }
  }, [
    minDate, maxDate, allowSelectionOutOfRange, disableMonthChange, updateMonth
  ]);

  const _onDayPress = useCallback((date?: DateData) => {
    if (date) {handleDayInteraction(date, onDayPress);}
  }, [ handleDayInteraction, onDayPress ]);

  const onLongPressDay = useCallback((date?: DateData) => {
    if (date) {handleDayInteraction(date, onDayLongPress);}
  }, [ handleDayInteraction, onDayLongPress ]);

  const renderWeekNumber = (weekNumber: number) => {
    return (
      <View style={style.current.dayContainer} key={`week-container-${weekNumber}`}>
        <BasicDay
          key={`week-${weekNumber}`}
          marking={weekNumberMarking.current}
          // state='disabled'
          theme={theme}
          testID={`${testID ?? ""}.weekNumber_${weekNumber}`}
        >
          {weekNumber}
        </BasicDay>
      </View>
    );
  };

  const renderDay = (day: XDate, id: number) => {
    const dayProps = extractDayProps(props);

    if (!sameMonth(day, currentMonth) && hideExtraDays) {
      return <View key={id} style={style.current.emptyDayContainer}/>;
    }

    const dateString = toMarkingFormat(day);

    return (
      <View style={style.current.dayContainer} key={id}>
        <Day
          {...dayProps}
          testID={`${testID ?? ""}.day_${dateString}`}
          date={dateString}
          state={getState(day, currentMonth, props)}
          marking={markedDates?.[dateString]}
          onPress={_onDayPress}
          onLongPress={onLongPressDay}
        />
      </View>
    );
  };

  const renderWeek = (days: XDate[], id: number) => {
    const week = [];

    days.forEach((day: XDate, id2: number) => {
      week.push(renderDay(day, id2));
    }, this);

    if (props.showWeekNumbers) {
      week.unshift(renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={style.current.week} key={id}>
        {week}
      </View>
    );
  };

  const renderMonth = () => {
    const shouldShowSixWeeks = showSixWeeks && !hideExtraDays;
    const days = page(currentMonth, firstDay, shouldShowSixWeeks);
    const weeks = [];

    while (days.length) {
      weeks.push(renderWeek(days.splice(0, 7), weeks.length));
    }

    return <View style={style.current.monthView}>{weeks}</View>;
  };

  const shouldDisplayIndicator = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (currentMonth) {
      const lastMonthOfDay = toMarkingFormat(currentMonth.clone().addMonths(1, true).setDate(1)
        .addDays(-1));
      if (displayLoadingIndicator && !markedDates?.[lastMonthOfDay]) {
        return true;
      }
    }
    return false;
  }, [
    currentMonth, displayLoadingIndicator, markedDates
  ]);

  const renderHeader = () => {
    const headerProps = extractHeaderProps(props);
    const ref = customHeader ? undefined : header;
    const CustomHeader = customHeader;
    const HeaderComponent = customHeader ? CustomHeader : CalendarHeader;

    return (
      <HeaderComponent
        {...headerProps}
        testID={`${testID ?? ""}.header`}
        style={headerStyle}
        ref={ref}
        month={currentMonth}
        addMonth={addMonth}
        displayLoadingIndicator={shouldDisplayIndicator}
      />
    );
  };

  return (
    <View
      style={[ style.current.container, propsStyle ]}
      testID={testID}
      accessibilityElementsHidden={accessibilityElementsHidden} // iOS
      importantForAccessibility={importantForAccessibility} // Android
    >
      {renderHeader()}
      {renderMonth()}
    </View>
  );
};

export default Calendar;
Calendar.displayName = "Calendar";
