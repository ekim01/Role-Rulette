// File used to mock axios specifically for react-native tests, 
// as the line jest.mock("axios") from the web app tests wouldn't work

const mockAxios = jest.genMockFromModule('axios')

export default mockAxios