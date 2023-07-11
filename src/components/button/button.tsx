import { PropsWithChildren } from "react";
import styles from "./button.module.scss";
import { classnames } from "../../utils/helpers";

export const enum ButtonVariations {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Variable = "variable",
}

interface IButtonProps {
  variation: ButtonVariations;
  width?: string;
  onClick?: () => void;
}

export const Button = (props: PropsWithChildren<IButtonProps>) => {
  const { children, variation, onClick } = props;

  return (
    <button
      className={classnames(styles.btn, styles[`btn_${variation}`])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
