/**
 * @ts-ignore # 忽视本行代码的小错误
 * @ts-nocheck # 忽略全文
 * @ts-check # 取消忽略全文
 */
import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import styles from "./index.less";

interface IProps {
  mackdown: string;
}

const Preview: React.FC<IProps> = ({ mackdown }) => {
  return (
    <div className={styles.container}>
      <ReactMarkdown
        children={mackdown}
        // children={`The lift coefficient ${markdownJS} is a dimensionless coefficient.`} // remarkMath 及 rehypeKatex 插件的作用
        remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // h1: "h2",
          blockquote: ({ node, ...props }) => (
            <blockquote className={styles.blockquote} {...props} />
          ),
        }}
      />
    </div>
  );
};

export default Preview;
