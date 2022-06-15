import React from "react";
import Link from "next/link";

const LinkComponent = ({
  className = "",
  children,
  onClick = () => {},
  href,
}) => {
  return (
    <Link href={href}>
      <a className={className} onClick={onClick}>
        {children}
      </a>
    </Link>
  );
};

export default LinkComponent;
