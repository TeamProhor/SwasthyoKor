import LogoSquare from "@/components/logo-square";

export type Props = {
  title?: string;
};

export default function OpengraphImage(props?: Props): React.ReactElement {
  const { title } = {
    ...{
      title: process.env.SITE_NAME || "স্বস্থ্যকর",
    },
    ...props,
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "-0.02em",
        fontWeight: 700,
        background: "white",
      }}
    >
      <div
        style={{
          left: 42,
          top: 42,
          position: "absolute",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LogoSquare size="sm" />
        <p
          style={{
            marginLeft: 12,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {process.env.SITE_NAME || "স্বস্থ্যকর"}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#047857",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
