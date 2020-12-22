
const supLookup = [
  '\u2070', '\u00b9',
  '\u00b2', '\u00b3',
  '\u2074', '\u2075',
  '\u2076', '\u2077',
  '\u2078', '\u2079',
];

export const numberToSuperscript = (input: number) => {
  let number = input;
  if (input < 0) {
    number = input * -1;
  }
  return `${number}`.split('.').map(v =>
    v.split('').map(x => supLookup[parseInt(x)]).join('')
  ).join('.');
}
