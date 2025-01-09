import React from "react";

const LayoutProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default LayoutProviders;
