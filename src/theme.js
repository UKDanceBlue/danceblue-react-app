import { StyleSheet } from 'react-native';

export const globalColors = {
  white: '#F2F3F8',
  darkNavy: '#1F2236',
  grey: '#8697B0',
  lightGrey: '#ffffc8',
  dbBlue: '#0033A0',
  lightBlue: '#8BA9FC',
  red: '#BA0725',
  green: '#55D128',
  dbSaffron: '#FFC72C',
};

export const globalStyles = StyleSheet.create({
  genericHeaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genericButton: {
    alignItems: 'center',
    backgroundColor: globalColors.dbSaffron,
    margin: 10,
    borderRadius: 5,
    padding: 10,
  },
  genericView: {
    flex: 1,
  },
  genericCenteredView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  genericText: {
    color: globalColors.darkNavy,
    fontSize: 15,
  },
  genericRow: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: globalColors.darkNavy,
  },
  genericRowLeft: {
    width: '20%',
    flexDirection: 'row',
  },
  genericRowCenter: {
    width: '50%',
    flexDirection: 'column',
    textAlign: 'center',
  },
  genericRowRight: {
    width: '30%',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  genericFillImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  genericIcon: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
});

export const globalTextStyles = StyleSheet.create({
  headerText: {
    ...globalStyles.genericText,
    fontSize: 16,
    textAlign: 'center',
  },
  boldText: {
    ...globalStyles.genericText,
    fontWeight: 'bold',
  },
  underlineText: {
    ...globalStyles.genericText,
    textDecorationLine: 'underline',
  },
  italicText: {
    ...globalStyles.genericText,
    fontStyle: 'italic',
  },
});
