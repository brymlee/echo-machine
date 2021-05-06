import _ from "lodash";
import { assign } from "xstate";
const { chain, split, size, includes } = _;

const backspace_filter = <
  T extends string,
  U extends string,
  V extends { input: string; outputs: string[]; sequence: T; flags: U[] },
  W extends { type: "APPLY" }
>() => {
  const selectedSequence = "\\b";
  const entry = assign((context: V, _event: W) => {
    const { input, sequence } = context;
    const oldOutputs = (() => {
      const { outputs } = context;
      return outputs;
    })();
    if (
      selectedSequence === sequence &&
      size(oldOutputs) !== 0 &&
      includes(input, selectedSequence)
    ) {
      const outputs = chain([
        chain(split(input, selectedSequence, 1))
          .map((s) => split(s, "", size(s)))
          .flatten()
          .reverse()
          .tail()
          .reverse()
          .reduce((a, b) => `${a}${b}`)
          .value(),
      ])
        .map((first) => {
          const second = chain(split(input, selectedSequence, size(oldOutputs)))
            .tail()
            .reduce((a, b) => `${a}\\b${b}`)
            .value();
          console.log(first);
          return `${first}${second}`;
        })
        .reduce((_a, b) => b)
        .value();
      const v: V = {
        ...context,
        outputs,
      };
      return v;
    }
    return context;
  });
  const _self = (() => {
    const cond = (context: V, _event: W) => {
      const { input } = context;
      return includes(input, selectedSequence);
    };
    return { target: "backspace_filter", cond };
  })();
  const always = [
    //_self,
    { target: "idle" },
  ];
  return {
    entry,
    always,
  };
};

export default backspace_filter;
