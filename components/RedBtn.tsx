interface RedBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  svgComponent?: React.ReactElement;
  outlineBtn?:boolean;
}

export default function RedBtn({ children, svgComponent, outlineBtn, ...props }: RedBtnProps) {
  const { ...rest } = props;

  const btnCSS = `group flex flex-row text-color-white-fresh items-center justify-center w-full px-1! py-3! rounded-full cursor-pointer lg:px-4!  hover:shadow-custom transition-shadow duration-300`;

  const btnOutlineCSS = `border border-solid border-color-gray`;
  const btnFilledCSS = `bg-red-brand-light`;

  console.log("CHILDREN = ", children);
  return (
    <button
      className={`${outlineBtn ? btnOutlineCSS : btnFilledCSS} ${btnCSS} `.trim()}
      {...rest}
    >
      <span className="text-[1rem] font-bold ">{children}</span>
      {svgComponent && <span className="pl-2!">{svgComponent}</span>}
    </button>
  );
}
