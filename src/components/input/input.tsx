import { ChangeEvent, useState } from "react";
import { classnames } from "../../utils/helpers";
import styles from "./input.module.scss";

interface IInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  changeHandler?: (value: string) => void;
  defaultValue?: string;
}

export const Input = (props: IInputProps) => {
  const {
    type,
    id,
    placeholder,
    label,
    className,
    defaultValue,
    changeHandler,
  } = props;
  const [value, setValue] = useState<string>(defaultValue ?? "");

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    changeHandler && changeHandler(event.target.value);
  };

  return (
    <div className={classnames(styles.container, className ?? "")}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        value={value}
        className={styles.input}
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={changeValue}
      />
    </div>
  );
};
