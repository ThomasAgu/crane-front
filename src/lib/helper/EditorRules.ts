export const rules = [
  { type: "app", possibleConnectionTypes: ['service'] },
  { type: "service", possibleConnectionTypes: ['network', 'volume']},
  { type: "volume", possibleConnectionTypes: []},
  { type: "network", possibleConnectionTypes: []},
]