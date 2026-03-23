import { ArrowSvg } from "@/components/Icon";

interface RedBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
    children:React.ReactNode;
}

export default function RedBtn({children,  ...props}:RedBtnProps){
  const {className = '', ...rest } = props;
  return(
    <button className={`button-filled ${className}`.trim()} {...rest}>
        <span>{children}</span> <ArrowSvg />
    </button>
  )
}