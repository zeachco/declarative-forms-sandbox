import {SchemaNode, ValidationError} from '@zeachco/declarative-forms/lib';

export function translateLabel(node: SchemaNode) {
  // HACK poorman translator mock
  const pathEnd = node.path.tail;
  return (
    pathEnd
      // space camel cased chars
      .replace(/([A-Z][a-z])/g, (val) => ` ${val}`)
      // make first char uppercase
      .replace(/^([a-z])/i, (val) => val.toUpperCase())
      // remove spaces around
      .trim()
  );
}

interface ErrorOptions {
  error: ValidationError<{
    format?: string;
    maximum?: number;
    minimum?: number;
    error?: string;
    message?: string;
    field?: string;
  }>;
}

export function translateError(_: SchemaNode, {error}: ErrorOptions) {
  // HACK poorman translator mock
  switch (error.type) {
    case 'server':
      return `Server Error "${error.data.error}"`;
    case 'Presence':
      return `${error.data.field} can’t be blank`;
    case 'Format':
      return (
        error.data.message || `The value should match ${error.data.format}`
      );
    case 'MaximumLength':
      return `The value cannot be longer than ${error.data.maximum} characters`;
    case 'MinimumLength':
      return `The value must be of at least ${error.data.minimum} characters`;
    default:
      return `Translation for <${error.type}]> validator`;
  }
}

function get(obj, path) {
  const [next, ...rest] = Array.isArray(path) ? path : path.split('.');
  const value = obj[next];
  if (!value) return '';
  if (!rest.length) {
    return value;
  }
  return get(value, rest);
}
