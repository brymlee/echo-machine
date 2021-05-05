import { Machine, assign } from 'xstate';
import _ from 'lodash';
const { map, flow, toArray } = _;

/*const backspaceFilter = (context: ReturnType<typeof initialContext>) => {
  if('flags' in context){
    const { flags, sequence } = context;
    if(flags.find((it) => it === '-e') && sequence === '\\b'){
      const { outputs } = context;
      const firstResult = outputs
        .map((it, index) => [it, index] as [string, number])
        .find(([it, ]) => it.includes('\\b'));
      if(firstResult){
        const [first, firstIndex] = firstResult;
        const x = first
          .split('\\b')
          .map((it, index) => {
            const split = it
              .split('');
            if(!split.find((_it) => true)){
              return [it, index] as [string, number];
            }
            const [a, ] = split
              .map((i, j) => [i, j] as [string, number])
              .reduce(([a, b], [c, d]) => [
                d === split.length - 1 ? a : `${a}${c}`, 
                d === split.length - 1 ? d : b
              ]);
            return [a, index] as [string, number];
          }).find(([, b]) => b === 0);
        if(x){
          const [head, ] = x;
          const newOutputs = outputs.map((it, i) => {
            if(i === firstIndex){
              const tail = it
                .split('\\b')
                .map((j, k) => [j, k !== 0 ? k : (-1)] as [string, number])
                .filter(([, k]) => k !== (-1))
                .map(([j, ]) => j)
                .reduce((a, b) => a ? `${a}\\b${b}` : b);
              return `${head}${tail}`;
            }
            return it;
          });
          const r: ReturnType<typeof initialSequence> = 'none'; 
          return {
            ...context,
            outputs: newOutputs,
            sequence: sequence === '\\b' ? r : sequence,
          };
        }
      }
    }
  }
  return context;
};

const states = () => ({
  idle: {
    on: {
      MAN: [{
        target: 'log',
        cond: isLogging,  
      }, {
        target: 'output', 
      }],
      LOG: 'log',
      OUTPUT: 'output', 
    },
  },
  log: {
    entry: assign((context: ReturnType<typeof initialContext>, event: ReturnType<typeof events>) => {
      const { type } = context;
      if('logs' in context){
        if('type' in context && context.type === 'man'){
          const output = 'this is a man';
          const outputs = [output];
          const logs = outputs.map((it) => (() => { console.log(it); }));
          return { 
            type,
            output,
            outputs, 
            logs, 
          };
        } else if('output' in context){
          const { output } = context;
          const outputs = [output];
          const logs = outputs.map((it) => (() => { console.log(it); }));
          return {
            type,
            output,
            outputs,
            logs,
          };
        } 
      } 
      return context;
    }),
    on: {
      IDLE: 'idle',
    }
  },
  output: {
    entry: assign((context: ReturnType<typeof initialContext>, event: ReturnType<typeof events>) => {
      const { type } = context;
      if('type' in context && context.type === 'man'){
        const output = 'this is a man';
        const outputs = [output];
        return {
          type,
          output,
          outputs,
        };
      } else if('output' in context){
        const { type, output } = context;
        const outputs = [output];
        return {
          type,
          output,
          outputs,
        };
      }
      return context;
    }),
    on: {
      IDLE: 'idle',
    },
  },
} as { idle: {}, log: {}, output: {}, });

const schema = () => ({
  states: states(),
} as { states: ReturnType<typeof states>, });
*/

toArray(
  (() => {
    const log: () => ('man' | 'normal') = () => 'normal';
    const initialSequence: () => ('none' | '\\b' | '\\c' | '\\e' | '\\f' | '\\n' | '\\r' | '\\t' | '\\v' | '\\0' | '\\hex') = () => 'none';
    const initialFlag: () => ('none' | '-n' | '-e' | '-E' | '--help' | '--version') = () => 'none'; 
    const events: () => ({ type: 'MAN', } | { type: 'IDLE', } | { type: 'OUTPUT', } | { type: 'LOG', }) = () => ({ type: 'IDLE', }); 
    const initialContext: 
      () => ({ 
          output: string, 
          outputs: string[], 
          type: ReturnType<typeof log>, 
          logs: (() => void)[],
          flags: ReturnType<typeof initialFlag>[], 
          sequence: ReturnType<typeof initialSequence>,
        }
      | { 
          output: string, 
          outputs: string[], 
          type: ReturnType<typeof log>, 
          flags: ReturnType<typeof initialFlag>[], 
          sequence: ReturnType<typeof initialSequence>,
        }) 
    = () => ({
      output: '',
      outputs: [],
      type: 'normal',
      flags: [],
      sequence: 'none',
    });
    const isLogging = (context: ReturnType<typeof initialContext>, event: ReturnType<typeof events>) => 'logs' in context;
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
  })()
)

const machine = [].map(({ initialSequence }) => initialSequence());

machine.forEach((it) => { console.log(it); return it; });

export default machine;

/*export const machine = Machine<
  ReturnType<typeof initialContext>,
  ReturnType<typeof schema>,
  ReturnType<typeof events>
>({
  key: 'echoMachine',
  initial: 'idle',
  context: initialContext(),
  states: states(),
}, actions());

const a = backspaceFilter({
  type: 'normal',
  output: 'hello\\bgoodbye\\b\\n',
  outputs: ['hello\\bgoodbye\\b\\n'],
  logs: [],
  flags: ['-e'],
  sequence: '\\b',
});
console.log(a);
console.log(backspaceFilter({ ...backspaceFilter(a), sequence: '\\b', }));*/
