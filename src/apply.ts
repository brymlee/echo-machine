import _ from "lodash";
const { size } = _;

const idle = <
  T extends string,
  U extends string,
  V extends { input: string; outputs: string[]; sequence: T; flags: U[] },
  W extends { type: "APPLY" }
>() => {
  const split = (() => {
    const cond = (context: V, _event: W) => {
      const { outputs, sequence } = context;
      const selectedSequence = "none";
      return size(outputs) === 0 && selectedSequence !== sequence;
    };
    return { target: "split", cond };
  })();
  const backspace_filter = (() => {
    const cond = (context: V, _event: W) => {
      const selectedSequence = "\\b";
      const { sequence } = context;
      return selectedSequence === sequence;
    };
    return { target: "backspace_filter", cond };
  })();
  const always = [split, backspace_filter, { target: "idle" }];
  return {
    always,
  };
};

export default idle;
