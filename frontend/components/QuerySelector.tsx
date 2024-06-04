'use client';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { formUrlQuery, removeKeysFromQuery } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Option {
  key: string;
  value: string;
}

interface Props {
  queryKey: string;
  options: Option[];
  placeholder: string;
  otherClasses?: string;
}

const QuerySelector = ({
  queryKey,
  options,
  placeholder,
  otherClasses,
}: Props) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSelect = (item: string) => {
    if (activeItem === item) {
      setActiveItem('');
      const newUrl = removeKeysFromQuery({
        keysToRemove: [queryKey],
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActiveItem(item);
      const newUrl = formUrlQuery({
        key: queryKey,
        value: item,
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <Select
      defaultValue={searchParams?.get(queryKey) || undefined}
      onValueChange={(e) => handleSelect(e)}
    >
      <SelectTrigger className={otherClasses}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={`${option.value}-${index}`} value={option.key}>
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default QuerySelector;
