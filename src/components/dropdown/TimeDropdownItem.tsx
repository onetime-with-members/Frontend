import clsx from 'clsx';

interface DropdownItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export default function TimeDropdownItem(props: DropdownItemProps) {
  const { children, className, ...rest } = props;

  return (
    <li
      className={clsx(
        'text-lg-200 w-full cursor-pointer py-2 text-center text-gray-50',
        className,
      )}
      {...rest}
    >
      {children}
    </li>
  );
}