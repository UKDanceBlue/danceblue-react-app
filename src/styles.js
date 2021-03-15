import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    margin: 10,
    height: '30%',
    borderRadius: 10,
    flex: 1
  },
  img: {
    height: '100%',
    width: '100%',
    opacity: 50
  },
  view: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    borderRadius: 10
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 50
  }
})
