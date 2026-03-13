import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {theme} from '../theme';
import {Block} from './Block';

export const HomeSkeleton = () => {
  return (
    <Block ph="layout" mt={1}>
      {[1, 2, 3].map((_, index) => (
        <Block key={index} mb={2}>
          <SkeletonPlaceholder
            backgroundColor={theme.colors.secondary[200]}
            highlightColor={theme.colors.secondary[100]}>
            <SkeletonPlaceholder.Item
              padding={16}
              borderRadius={theme.borderRadius.md}>
              <SkeletonPlaceholder.Item
                width={80}
                height={20}
                borderRadius={4}
              />

              <SkeletonPlaceholder.Item
                marginTop={12}
                width="100%"
                height={24}
                borderRadius={4}
              />

              <SkeletonPlaceholder.Item flexDirection="row" marginTop={20}>
                <SkeletonPlaceholder.Item
                  width={100}
                  height={14}
                  borderRadius={4}
                />
                <SkeletonPlaceholder.Item
                  marginLeft={20}
                  width={100}
                  height={14}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </Block>
      ))}
    </Block>
  );
};
