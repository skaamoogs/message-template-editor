import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./textarea.module.scss";
import { classnames } from "../../utils/helpers";

const DEFAUlT_MIN_HEIGHT = 32;

interface ITextareaProps {
  label?: string;
  minHeight?: number;
  changeHandler?: (value: string) => void;
}

export const Textarea = (props: ITextareaProps) => {
  const { minHeight, label, changeHandler } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState("");

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
        className={styles.textarea}
        value={value}
        ref={textareaRef}
        onChange={onChange}
      />
    </>
  );
};
