import { ArrowSvg } from "@/components/Icon";

interface RedBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function RedBtn({ children, ...props }: RedBtnProps) {
  const { className = "", ...rest } = props;

  // The 'group' class here activates the translate-x-1 animation sitting inside your ArrowSvg
  const btnCSS = `group flex flex-row text-white items-center justify-center w-full px-1 py-3! rounded-full cursor-pointer lg:px-2 bg-[#ff0099] hover:shadow-[2px_4px_10px_#ff009965] transition-shadow duration-300`;
  console.log("CLASSNAME =", className);
  console.log("CHILDREN = ", children);
  return (
    <button className={`${btnCSS} ${className}`.trim()} {...rest}>
      <span className="text-[1rem] font-bold transition-transform duration-200 ease-linear group-hover:scale-110">
        {children}
      </span>
      <ArrowSvg />
    </button>
  );
}
