import { Validator } from './ValidatorInterface';

const BALANCED_PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
};

const DURATION_REGEX = /^\d+[smhdwy]$/;
const TOKEN_REGEX = /^[\w:\.\-\+\*\/\%\!\=\<\>\|\&\^\~\s\[\]\{\}\(\)\,\"\'\.]+$/;

const isBalanced = (value: string): boolean => {
  const stack: string[] = [];
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (inSingleQuote || inDoubleQuote) {
      continue;
    }

    if (char in BALANCED_PAIRS) {
      stack.push(char);
      continue;
    }

    if (Object.values(BALANCED_PAIRS).includes(char)) {
      const last = stack.pop();
      if (!last || BALANCED_PAIRS[last] !== char) {
        return false;
      }
    }
  }

  return stack.length === 0 && !inSingleQuote && !inDoubleQuote;
};

const validateRangeVectors = (value: string): boolean => {
  const ranges = value.match(/\[[^\]]*\]/g);
  if (!ranges) return true;

  return ranges.every((rawRange) => {
    const content = rawRange.slice(1, -1).trim();
    return DURATION_REGEX.test(content);
  });
};

const hasDisallowedTokens = (value: string): boolean => {
  return !TOKEN_REGEX.test(value);
};

const hasEmptyParenthesis = (value: string): boolean => {
  return /\(\s*\)/.test(value) || /\[\s*\]/.test(value) || /\{\s*\}/.test(value);
};

const isBareMetricSelector = (value: string): boolean => {
  const bareSelector = /^[a-zA-Z_:][\w:]*\s*(\{[^}]*\})?\s*(\[[^\]]+\])?$/;
  return bareSelector.test(value);
};

const hasComparisonOrBinary = (value: string): boolean => {
  return /(?:==|!=|=~|!~|<=|>=|<|>)/.test(value);
};

const isFunctionCall = (value: string): boolean => {
  return /^[a-zA-Z_][\w_]*\s*\(/.test(value);
};

const prometheusExpressionValidator: Validator = {
  isValid: (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }

    if (!isBalanced(trimmed)) {
      return false;
    }

    if (hasDisallowedTokens(trimmed)) {
      return false;
    }

    if (hasEmptyParenthesis(trimmed)) {
      return false;
    }

    if (!validateRangeVectors(trimmed)) {
      return false;
    }

    if (isBareMetricSelector(trimmed) && !hasComparisonOrBinary(trimmed) && !isFunctionCall(trimmed)) {
      return false;
    }

    return true;
  },
  message:
    'La expresión PromQL parece ser solo un selector básico. Para alertas usa comparación o función, por ejemplo `up == 0` o `rate(requests_total[5m]) > 100`.',
};

export { prometheusExpressionValidator };
