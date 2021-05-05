import { Machine, assign } from "xstate";
import _ from "lodash";
import backspaceFilter from "./backspaceFilter";
const { map, chain } = _;

chain(
  map(
    [
      (() => {
        const log: () => "man" | "normal" = () => "normal";
        const initialSequence: () =>
          | "none"
          | "\\b"
          | "\\c"
          | "\\e"
          | "\\f"
          | "\\n"
          | "\\r"
          | "\\t"
          | "\\v"
          | "\\0"
          | "\\hex" = () => "none";
        const initialFlag: () =>
          | "none"
          | "-n"
          | "-e"
          | "-E"
          | "--help"
          | "--version" = () => "none";
        const events: () =>
          | { type: "MAN" }
          | { type: "IDLE" }
          | { type: "OUTPUT" }
          | { type: "LOG" } = () => ({ type: "IDLE" });
        const initialContext: () =>
          | {
              output: string;
              outputs: string[];
              type: ReturnType<typeof log>;
              logs: (() => void)[];
              flags: ReturnType<typeof initialFlag>[];
              sequence: ReturnType<typeof initialSequence>;
            }
          | {
              output: string;
              outputs: string[];
              type: ReturnType<typeof log>;
              flags: ReturnType<typeof initialFlag>[];
              sequence: ReturnType<typeof initialSequence>;
            } = () => ({
          output: "",
          outputs: [],
          type: "normal",
          flags: [],
          sequence: "none",
        });
        const isLogging = (
          context: ReturnType<typeof initialContext>,
          event: ReturnType<typeof events>
        ) => "logs" in context;
        const actions = () => ({
          guards: {
            isLogging: isLogging,
          },
        });
        return {
          initialSequence,
          initialFlag,
          events,
          initialContext,
          isLogging,
          log,
          actions,
        };
      })(),
    ],
    (it) => it
  )
)
  .map((it) => {
    const { isLogging, initialContext, events } = it;
    const head = (() => {
      const entry = assign(
        (
          context: ReturnType<typeof initialContext>,
          event: ReturnType<typeof events>
        ) => {
          const { type } = context;
          if ("logs" in context) {
            if ("type" in context && context.type === "man") {
              const output = "this is a man";
              const outputs = [output];
              const logs = outputs.map((it) => () => {
                console.log(it);
              });
              return {
                type,
                output,
                outputs,
                logs,
              };
            } else {
              const { output } = context;
              const outputs = [output];
              const logs = outputs.map((it) => () => {
                console.log(it);
              });
              return {
                type,
                output,
                outputs,
                logs,
              };
            }
          }
          return context;
        }
      );
      return {
        idle: {
          on: {
            MAN: [
              {
                target: "log",
                cond: isLogging,
              },
              {
                target: "output",
              },
            ],
            LOG: "log",
            OUTPUT: "output",
          },
        },
        log: {
          entry,
          on: {
            IDLE: "idle",
          },
        },
      };
    })();
    const tail = (() => {
      const entry = assign(
        (
          context: ReturnType<typeof initialContext>,
          event: ReturnType<typeof events>
        ) => {
          const { type } = context;
          if ("type" in context && context.type === "man") {
            const output = "this is a man";
            const outputs = [output];
            return {
              type,
              output,
              outputs,
            };
          } else {
            const { type, output } = context;
            const outputs = [output];
            return {
              type,
              output,
              outputs,
            };
          }
          return context;
        }
      );
      return {
        output: {
          entry,
          on: {
            IDLE: "idle",
          },
        },
      };
    })();
    const possibleStates: () => { idle: {}; log: {}; output: {} } = () => ({
      ...head,
      ...tail,
    });
    const schema = () => {
      const states = possibleStates();
      return {
        states,
      };
    };
    const states = possibleStates;
    const machine = (() => {
      const key = "echoMachine";
      const initial = "idle";
      const actions = it.actions();
      const context = initialContext();
      const states = possibleStates();
      return Machine<
        ReturnType<typeof initialContext>,
        ReturnType<typeof schema>,
        ReturnType<typeof events>
      >(
        {
          key,
          initial,
          context,
          states,
        },
        actions
      );
    })();
    return {
      ...it,
      states,
      schema,
      machine,
    };
  })
  .forEach(({ states, initialContext, initialSequence, initialFlag }) => {
    const selectedSequence: ReturnType<typeof initialSequence> = "\\b";
    const partial = backspaceFilter<
      ReturnType<typeof initialContext>,
      ReturnType<typeof initialSequence>,
      ReturnType<typeof initialFlag>
    >(selectedSequence);
    const a: ReturnType<typeof initialContext> = {
      type: "normal",
      output: "hello\\bgoodbye\\b\\n",
      outputs: ["hello\\bgoodbye\\b\\n"],
      logs: [],
      flags: ["-e"],
      sequence: "\\b",
    };
    const sequenceOrigin: ReturnType<typeof initialSequence> = "none";
    const selectedFlag: ReturnType<typeof initialFlag> = "-e";
    console.log(a);
    const b = partial(a.sequence)(sequenceOrigin)(a.flags)(selectedFlag)(
      a.outputs
    )((sequence) => (outputs) => ({
      ...a,
      sequence,
      outputs,
    }));
    console.log(b);
    const c = partial(a.sequence)(sequenceOrigin)(b.flags)(selectedFlag)(
      b.outputs
    )((sequence) => (outputs) => ({
      ...b,
      sequence,
      outputs,
    }));
    console.log(c);
  })
  .value();
