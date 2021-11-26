import { StyleSheet } from 'react-native';

export const globalColors = {
  white: '#F2F3F8',
  darkNavy: '#1F2236',
  grey: '#8697B0',
  lightGrey: '#ffffc8',
  dbBlue: '#212FA1',
  lightBlue: '#8BA9FC',
  red: '#BA0725',
  green: '#55D128',
  dbSaffron: '#F6D139',
};

export const globalStyles = StyleSheet.create({
  genericBackground: {
    flex: 3,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  genericIcon: {
    width: 50,
    height: 50,
  },
  genericHeaderContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globalColors.lightBlue,
  },
  avatar: {
    flex: 1,
    height: 100,
    width: 100,
    resizeMode: 'contain',
    paddingLeft: 50,
  },
  genericButton: {
    alignItems: 'center',
    backgroundColor: globalColors.dbSaffron,
    margin: 10,
    height: '30%',
    borderRadius: 10,
    flex: 1,
  },
  genericView: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globalColors.white,
    flex: 1,
    borderRadius: 10,
  },
  genericText: {
    color: globalColors.darkNavy,
    fontWeight: 'bold',
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
