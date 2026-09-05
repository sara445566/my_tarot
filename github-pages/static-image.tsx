import type { ImgHTMLAttributes } from 'react';

type StaticImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> & {
  alt: string;
  fill?: boolean;
};

export default function StaticImage({ fill: _fill, alt, ...props }: StaticImageProps) {
  // oxlint-disable-next-line next/no-img-element
  return <img alt={alt} {...props} />;
}
