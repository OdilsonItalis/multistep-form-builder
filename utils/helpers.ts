import { Price } from 'types';

export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ''
      ? process.env.URL
      : process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ''
      ? process.env.VERCEL_URL
      : 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: {
    price?: Price;
    priceId?: string;
    metadata?: {
      referred_by?: string;
      subscribed_to?: string;
    };
  };
}) => {
  console.log('posting,', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

// thats from me

export const toBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getBase64FromUrl = async (url: string) => {
  try {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  } catch (error) {
    console.log(error);
  }
};

export const storePromoModalSeenStatusToLocalStorage = ({
  modalNumber,
  seenAt
}: {
  modalNumber: number;
  seenAt: string;
}): void => {
  localStorage.setItem(`promotion_${modalNumber}SeenAt`, seenAt);
};

export const getCurrencySign = (currency: 'usd' | 'eur' | 'gbp'): string => {
  switch (currency) {
    case 'usd':
      return '$';
    case 'eur':
      return '€';
    case 'gbp':
      return '£';
    default:
      return '';
  }
};

// this basically converts price from hundreds to decimal
export const formatPrice = (price: number, currency: 'usd' | 'eur' | 'gbp') => {
  const currencySign = getCurrencySign(currency);
  const formattedPrice = (price / 100).toFixed(2);
  const roundedPrice = parseFloat(formattedPrice).toString();
  const hasDecimal = roundedPrice.indexOf('.') !== -1;
  return `${currencySign}${
    hasDecimal ? roundedPrice : Math.round(price / 100)
  }`;
};

// this basically converts price from hundreds to decimal
export const formatPriceWithoutCurrency = (price: number) => {
  const formattedPrice = (price / 100).toFixed(2);
  const roundedPrice = parseFloat(formattedPrice).toString();
  const hasDecimal = roundedPrice.indexOf('.') !== -1;
  return `${hasDecimal ? roundedPrice : Math.round(price / 100)}`;
};

// function that calculates the percentage difference between the original price and the discounted price
export const calculatePercentageDifference = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return ((originalPrice - discountedPrice) / originalPrice) * 100;
};

export function base64StringtoFile(
  base64String: string,
  filename: string
): File | null {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
