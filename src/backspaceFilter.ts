const backspaceFilter = <T extends {}, U extends string, V extends string>(
  selectedSequence: U
) => (initialSequence: U) => (originSequence: U) => (flags: V[]) => (
  selectedFlag: V
) => (initialOutputs: string[]) => (
  transformation: (_sequence: U) => (_outputs: string[]) => T
) => {
  if (
    flags.find((it) => selectedFlag) &&
    initialSequence === selectedSequence
  ) {
    const firstResult = initialOutputs
      .map((it, index) => [it, index] as [string, number])
      .find(([it]) => it.includes(selectedSequence));
    if (firstResult) {
      const [first, firstIndex] = firstResult;
      const x = first
        .split(selectedSequence)
        .map((it, index) => {
          const split = it.split("");
          if (!split.find((_it) => true)) {
            return [it, index] as [string, number];
          }
          const [a] = split
            .map((i, j) => [i, j] as [string, number])
            .reduce(([a, b], [c, d]) => [
              d === split.length - 1 ? a : `${a}${c}`,
              d === split.length - 1 ? d : b,
            ]);
          return [a, index] as [string, number];
        })
        .find(([, b]) => b === 0);
      if (x) {
        const [head] = x;
        const outputs = initialOutputs.map((it, i) => {
          if (i === firstIndex) {
            const tail = it
              .split(selectedSequence)
              .map((j, k) => [j, k !== 0 ? k : -1] as [string, number])
              .filter(([, k]) => k !== -1)
              .map(([j]) => j)
              .reduce((a, b) => (a ? `${a}${selectedSequence}${b}` : b));
            return `${head}${tail}`;
          }
          return it;
        });
        const sequence = originSequence;
        return transformation(sequence)(outputs);
      }
    }
  }
  return transformation(initialSequence)(initialOutputs);
};

export default backspaceFilter;
