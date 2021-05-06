import { actions, assign } from "xstate";
import _ from "lodash";
const { size, some, split, includes } = _;

const _split = <
  T extends string,
  U extends string,
  V extends { input: string; outputs: string[]; sequence: T; flags: U[] },
  W extends { type: "APPLY" }
>() => {
  const entry = assign((context: V, event: W) => {
    const { input, outputs, sequence } = context;
    const selectedSequence = "none";
    if (size(outputs) === 0 && sequence !== selectedSequence) {
      if (includes(input, sequence)) {
        const outputs = split(input, sequence);
        const v: V = {
          ...context,
          outputs,
        };
        return v;
      }
    }
    return context;
  });
  const backspace_filter = (() => {
    const cond = (context: V, _event: W) => {
      const selectedSequence = "\\b";
      const { sequence } = context;
      return selectedSequence === sequence;
    };
    return { target: "backspace_filter", cond };
  })();
  const always = [backspace_filter, { target: "idle" }];
  return {
    entry,
    always,
  };
};

export default _split;
