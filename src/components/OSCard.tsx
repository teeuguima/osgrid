import React from 'react';
import {ChevronRight, User, Calendar} from 'lucide-react-native';
import {theme} from '../theme';

import {Block} from './Block';
import {Typography} from './Typography';
import {Card} from './Card';
import {Badge} from './Badge';

interface OSCardProps {
  title: string;
  technician: string;
  date: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'primary';
  onPress: () => void;
}

export const OSCard = ({
  title,
  technician,
  date,
  status,
  statusVariant,
  onPress,
}: OSCardProps) => {
  const iconColor = theme.colors.primary[600];

  return (
    <Card mb={1} onPress={onPress}>
      <Block row between center mb={1}>
        <Badge label={status} variant={statusVariant} />
        <ChevronRight size={20} color={theme.colors.text.light} />
      </Block>

      <Block gap={1.5}>
        <Typography variant="bodyBold" numberOfLines={1} mb={2}>
          {title}
        </Typography>

        <Block row center gap={2}>
          <Block row center>
            <User size={20} color={iconColor} />
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={{marginLeft: 4}}>
              {technician}
            </Typography>
          </Block>

          <Block row center>
            <Calendar size={20} color={iconColor} />
            <Typography
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={{marginLeft: 4}}>
              {date}
            </Typography>
          </Block>
        </Block>
      </Block>
    </Card>
  );
};
