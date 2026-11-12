import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  /** Optional element placed at the end of the input (e.g. show/hide button) */
  trailing?: ReactNode;
}

export default function TextField({ id, label, trailing, className = "", ...rest }: TextFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[.82rem] font-bold text-mute">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`h-11 w-full border-0 border-b-[1.5px] border-line bg-transparent px-0.5 text-base outline-none transition focus:border-gold ${
            trailing ? "pe-12" : ""
          } ${className}`}
          {...rest}
        />
        {trailing}
      </div>
    </div>
  );
}
