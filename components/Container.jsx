import clsx from 'clsx';

export function Container({ className, ...props }) {
  return (
    <div
      // className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      // changed the max width to less than 7xl
      className={clsx('mx-auto max-w-4xl px-2 sm:px-0 md-px-0', className)}
      {...props}
    />
  );
}
