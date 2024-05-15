import React, { ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import styles from "./index.less";

interface IProps {
  children?: ReactNode;
  height?: string;
  needScroll?: boolean;
  needPadding?: boolean;
  autoHide?: boolean;
  contentPadding?: string;
  onScrollFrame?: Function;
  scrollRef?: any;
  noRightPadding?: boolean;
}

const Content: React.FC<IProps> = ({
  children,
  height,
  needScroll = true,
  needPadding = true,
  autoHide = true,
  contentPadding,
  onScrollFrame,
  scrollRef,
  noRightPadding,
}) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.wrap}
        style={{
          height,
          padding: !needPadding ? 0 : noRightPadding ? "6px 0 6px 6px" : "6px",
        }}
      >
        <div className={styles.content} style={{ padding: contentPadding }}>
          {needScroll ? (
            <Scrollbars
              autoHide={autoHide}
              className={styles.scroll}
              onScrollFrame={onScrollFrame && onScrollFrame}
              ref={scrollRef}
            >
              <div className={styles.scrollContent}> {children}</div>
            </Scrollbars>
          ) : (
            <div className={styles.noScroll}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
