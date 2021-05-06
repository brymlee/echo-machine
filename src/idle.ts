const idle = <
  T extends string,
  U extends string,
  V extends { input: string; outputs: string[]; sequence: T; flags: U[] },
  W extends { type: "APPLY" }
>() => {
  return {
    on: {
      APPLY: "apply",
    },
  };
};

export default idle;
