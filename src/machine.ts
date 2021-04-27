import { Machine, assign } from 'xstate';

const isLogging = (context: ReturnType<typeof initialContext>, event: ReturnType<typeof events>) => 'logs' in context;

const states = () => ({
  idle: {
    on: {
      MAN: [{
        target: 'log',
        cond: isLogging,  
      }, {
        target: 'output', 
      }],
      OUTPUT: 'output', 
    },
  },
  log: {
    entry: assign((context: ReturnType<typeof initialContext>, event: ReturnType<typeof events>) => {
      const output = 'this is a man';
      const outputs = [output];
      if('type' in context && context.type === 'man' && 'logs' in context){
        const { type } = context;
        return { 
          type: type,
          output: output,
          outputs: outputs, 
          logs: outputs.map((it) => (() => { console.log(it); })), 
        };
      } else if('type' in context && context.type === 'normal' && 'output' in context){
        const { type, output } = context;
        return {
          type: type,
          output: output,
          outputs: outputs,
        };
      }
      return context;
    }),
    on: {
      IDLE: 'idle',
    }
  },
  output: {
    entry: [assign((context: ReturnType<typeof initialContext>, event: ReturnType<typeof events>) => {
      if('type' in context && context.type === 'man'){
        const { type } = context;
        const output = 'this is a man';
        const outputs = [output];
        return {
          type: type,
          output: output,
          outputs,
        };
      }
      if('output' in context){
        const { output } = context;
        return {
          type: 'normal',
          output: output,
          outputs: output.split('\\n'),
        };
      }
      return context;
    })],
    on: {
      IDLE: 'idle',
    },
  },
} as { idle: {}, log: {}, output: {}, });

const schema = () => ({
  states: states(),
} as { states: ReturnType<typeof states>, });

const log = () => 'normal' as ('man' | 'normal');

const initialContext = () => ({
  outputs: [] as string[],
} as (
    { outputs: string[], }
  | { output: string, outputs: string[], type: ReturnType<typeof log>, }
  | { outputs: string[], logs: (() => void)[], type: ReturnType<typeof log>, } 
  | { output: string, outputs: string[], logs: (() => void)[], type: ReturnType<typeof log>, } 
));

const events = () => ({ type: 'IDLE', } as ({ type: 'MAN', } | { type: 'IDLE', } | { type: 'OUTPUT', } | { type: 'LOG', }));

const actions = () => ({
  guards: {
    isLogging: isLogging,
  },
});

export const machine = Machine<
  ReturnType<typeof initialContext>,
  ReturnType<typeof schema>,
  ReturnType<typeof events>
>({
  key: 'echoMachine',
  initial: 'idle',
  context: initialContext(),
  states: states(),
}, actions());
const newMachine = machine
  .withContext({
    type: 'man',
    output: 'hello\\ngoodbye\\n',
    outputs: [],
    logs: [],
  });
const { initialState } = newMachine; 
console.log(initialState.context);
const a = newMachine.transition(initialState, { type: 'MAN', });
const b = newMachine.transition(a, { type: 'IDLE', });
if('logs' in b.context){
  b.context.logs.forEach((it) => { it(); }); 
}
