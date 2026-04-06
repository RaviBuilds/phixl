
interface RedLabelProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children:React.ReactNode
}

export default function RedLabel({children}:RedLabelProps){

    return (
      <span className="text-red-brand-light bg-[#ff009923] border-[#ff009946] border border-solid mb-6! inline-block rounded-3xl text-[0.7rem] px-5! py-2! mx-auto!">
        {children}
      </span>
    );
}