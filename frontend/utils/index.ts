import qs from 'query-string';
import CryptoJS from 'crypto-js';
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from 'react-icons/fc';
interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location?.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const getPriorityData = (priorty: number) => {
  switch (priorty) {
    case 1: {
      return {
        text: 'High',
        textColor: 'text-red-200 dark:text-red-500',
        bg: 'bg-red-500/10 dark:bg-red-500/20',
        icon: FcHighPriority,
      };
    }
    case 2: {
      return {
        text: 'Medium',
        textColor: 'text-orange-200 dark:text-orange-500',
        bg: 'bg-orange-500/10 dark:bg-orange-500/20',
        icon: FcMediumPriority,
      };
    }
    case 3: {
      return {
        text: 'Low',
        textColor: 'text-green-200 dark:text-green-500',
        bg: 'bg-green-500/10 dark:bg-green-500/20',
        icon: FcLowPriority,
      };
    }
    default: {
      return {
        text: 'Low',
        textColor: 'text-green-200 dark:text-green-500',
        bg: 'bg-green-500/10 dark:bg-green-500/20',
        icon: FcLowPriority,
      };
    }
  }
};
