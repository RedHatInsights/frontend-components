import React from 'react';
import { Text } from '@react-pdf/renderer';

export const customTitle = (title) =>
  Array.isArray(title)
    ? title.map((oneText, textKey) => (
        <Text
          key={textKey}
          style={{
            ...oneText.style,
            ...(oneText.fontWeight && { fontWeight: oneText.fontWeight }),
            ...(oneText.fontStyle && { fontStyle: oneText.fontStyle }),
            ...(oneText.fontSize && { fontSize: oneText.fontSize }),
          }}
        >
          {oneText.title || oneText}
        </Text>
      ))
    : title;
