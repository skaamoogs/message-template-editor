import styles from "./input.module.scss";

interface IInputProps {
  id: string;
  type?: string;
}

export const Input = (props: IInputProps) => {
  const { type, id } = props;
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}></label>
      <input className={styles.input} type={type ?? "text"} id={id} />
    </div>
  );
};
