import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import styles from "./textarea.module.scss";
import { classnames } from "../../utils/helpers";

const DEFAUlT_MIN_HEIGHT = 32;

interface ITextareaProps {
  defaultText?: string;
  label?: string;
  minHeight?: number;
  changeHandler?: (event: any) => void;
  focusHandler?: (event: any) => void;
  className?: string;
}

export const Textarea = (props: ITextareaProps) => {
  const {
    defaultText,
    minHeight,
    label,
    className,
    changeHandler,
    focusHandler,
  } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(defaultText);

  useEffect(() => setValue(defaultText), [defaultText]);

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    changeHandler && changeHandler(event);
  };

  const moveCaret = (event: any) => {
    changeHandler && changeHandler(event);
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
    <div className={classnames(styles.container, className ?? "")}>
      {label && <label>{label}</label>}
      <textarea
        className={styles.text}
        value={value}
        ref={textareaRef}
        onChange={onChange}
        onKeyDown={moveCaret}
        onClick={moveCaret}
        onFocus={focusHandler}
      />
    </div>
  );
};
