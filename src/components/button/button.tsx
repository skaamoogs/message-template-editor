import { PropsWithChildren } from "react";
import styles from "./button.module.scss";
import { classnames } from "../../utils/helpers";

export const enum ButtonVariations {
  Primary = "primary",
  Secondary = "secondary",
  Danger = "danger",
  Variable = "variable",
  Light = "light",
}

interface IButtonProps {
  variation: ButtonVariations;
  width?: string;
  className?: string;
  onClick?: () => void;
}

export const Button = (props: PropsWithChildren<IButtonProps>) => {
  const { children, variation, className, onClick } = props;

  return (
    <button
      className={classnames(styles.btn, styles[`btn_${variation}`], className ?? "")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
