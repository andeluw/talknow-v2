import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import useNavStore from '@/stores/useNavStore';

interface NavButtonProps {
  name: string;
  icon?: IconType | LucideIcon;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function NavButton({ name, icon, onClick }: NavButtonProps) {
  const active = useNavStore.useActive();
  const setActive = useNavStore.useSetActive();

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
    setActive(name);
  };

  return (
    <IconButton
      variant='transparent'
      icon={icon}
      className={cn(
        'w-[64px] h-[56px] transition-colors duration-200 rounded-md',
        active === name ? 'text-foreground' : ''
      )}
      classNames={{ icon: 'text-2xl font-bold' }}
      isIconFilled={active === name && name !== 'search'}
      onClick={handleOnClick}
    />
  );
}
