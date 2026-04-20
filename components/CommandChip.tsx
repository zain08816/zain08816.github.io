"use client";

import styles from "./CommandChip.module.css";

export function CommandChip({
  command,
  onRun,
  columnWidthCh,
}: {
  command: string;
  onRun: (cmd: string) => void;
  columnWidthCh: number;
}) {
  return (
    <button
      type="button"
      className={styles.cmd}
      style={{
        width: `${columnWidthCh}ch`,
        minWidth: `${columnWidthCh}ch`,
      }}
      onClick={() => onRun(command)}
    >
      {command}
    </button>
  );
}
