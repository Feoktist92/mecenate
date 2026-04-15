import '@testing-library/jest-native/extend-expect';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name }: { name: string }) => React.createElement(Text, null, name);

  return {
    Ionicons: MockIcon,
  };
});

jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockBlurView = ({ children, ...props }: any) =>
    React.createElement(View, props, children);

  return {
    BlurView: MockBlurView,
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockSvgComponent = ({ children, ...props }: any) =>
    React.createElement(View, props, children);

  return {
    __esModule: true,
    default: MockSvgComponent,
    SvgUri: MockSvgComponent,
    Path: MockSvgComponent,
  };
});
