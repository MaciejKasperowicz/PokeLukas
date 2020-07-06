// import React from 'react';
// import { View, TextInput } from 'react-native';

// export const ListHeader = props => {
//   return (
//     <View>
//       <TextInput placeholder="search" onChangeText={props.onChangeText} />
//     </View>
//   );
// };

// import React from 'react';
// import { View, TextInput } from 'react-native';

// export const ListHeader = props => {
//   return (
//     <View>
//       <TextInput placeholder="search" {...props} />
//     </View>
//   );
// };

import React from 'react';
import { View, TextInput } from 'react-native';

export const ListHeader = props => {
  return (
    <View>
      <TextInput placeholder="search" onChangeText={props.onChange} />
    </View>
  );
};