import { Machine } from "xstate";
import _ from "lodash";
import _backspace_filter from "./backspace_filter";
import _apply from "./apply";
import _split from "./split";
import _idle from "./idle";
const { map, chain, some } = _;

chain(
  map(
    [
      (() => {
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
          | "--version"
          | "--man" = () => "none";
        const events: () => { type: "APPLY" } = () => ({ type: "APPLY" });
        const initialContext: () => {
          input: string;
          outputs: string[];
          flags: ReturnType<typeof initialFlag>[];
          sequence: ReturnType<typeof initialSequence>;
        } = () => ({
          input: "",
          outputs: [],
          flags: [],
          sequence: "none",
        });
        const isBackspaceSequenceExists = (
          context: ReturnType<typeof initialContext>,
          _event: ReturnType<typeof events>
        ) => {
          const { outputs } = context;
          const backspaceSequence: ReturnType<typeof initialSequence> = "\\b";
          return some(outputs, ({ includes }) => includes(backspaceSequence));
        };
        const actions = () => ({
          guards: {
            isBackspaceSequenceExists,
          },
        });
        return {
          initialSequence,
          initialFlag,
          events,
          initialContext,
          actions,
        };
      })(),
    ],
    (it) => it
  )
)
  .map((it) => {
    const { initialSequence, initialContext, events, initialFlag } = it;
    const idle = _idle<
      ReturnType<typeof initialSequence>,
      ReturnType<typeof initialFlag>,
      ReturnType<typeof initialContext>,
      ReturnType<typeof events>
    >();
    const apply = _apply<
      ReturnType<typeof initialSequence>,
      ReturnType<typeof initialFlag>,
      ReturnType<typeof initialContext>,
      ReturnType<typeof events>
    >();
    const split = _split<
      ReturnType<typeof initialSequence>,
      ReturnType<typeof initialFlag>,
      ReturnType<typeof initialContext>,
      ReturnType<typeof events>
    >();
    const backspace_filter = _backspace_filter<
      ReturnType<typeof initialSequence>,
      ReturnType<typeof initialFlag>,
      ReturnType<typeof initialContext>,
      ReturnType<typeof events>
    >();
    const possibleStates: () => {
      idle: {};
      split: {};
      apply: {};
      backspace_filter: {};
    } = () => {
      return {
        idle,
        apply,
        split,
        backspace_filter,
      };
    };
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
  .forEach(
    ({ machine, states, initialContext, initialSequence, initialFlag }) => {
      const sequence: ReturnType<typeof initialSequence> = "\\b";
      const newMachine = machine.withContext({
        ...machine.initialState.context,
        input: "abcd\\befgh\\bijkl",
        sequence,
      });
      console.log(newMachine.initialState.context);
      const b = newMachine.transition(newMachine.initialState, "APPLY");
      console.log(b.context);
    }
  )
  .value();
