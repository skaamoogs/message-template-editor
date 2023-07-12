import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./textarea.module.scss";
import { classnames } from "../../utils/helpers";

const DEFAUlT_MIN_HEIGHT = 32;

interface ITextareaProps {
  defaultText?: string;
  label?: string;
  minHeight?: number;
  changeHandler?: (value: string) => void;
  className?: string;
}

export const Textarea = (props: ITextareaProps) => {
  const { defaultText, minHeight, label, className, changeHandler } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(defaultText);

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    changeHandler && changeHandler(event.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${minHeight ?? DEFAUlT_MIN_HEIGHT}px`;
      textareaRef.current.style.height = `${Math.max(
        minHeight ?? DEFAUlT_MIN_HEIGHT,
        textareaRef.current.scrollHeight
      )}px`;
    }
  }, [value, minHeight]);

  return (
    <>
      {label && <label>{label}</label>}
      <textarea
        className={classnames(styles.textarea, className ?? "")}
        value={value}
        ref={textareaRef}
        onChange={onChange}
      />
    </>
  );
};
