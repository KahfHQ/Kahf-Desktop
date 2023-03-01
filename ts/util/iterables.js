var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var iterables_exports = {};
__export(iterables_exports, {
  collect: () => collect,
  concat: () => concat,
  every: () => every,
  filter: () => filter,
  find: () => find,
  groupBy: () => groupBy,
  isEmpty: () => isEmpty,
  isIterable: () => isIterable,
  join: () => join,
  map: () => map,
  reduce: () => reduce,
  repeat: () => repeat,
  size: () => size,
  take: () => take,
  zipObject: () => zipObject
});
module.exports = __toCommonJS(iterables_exports);
var import_getOwn = require("./getOwn");
function isIterable(value) {
  return typeof value === "object" && value !== null && Symbol.iterator in value || typeof value === "string";
}
function size(iterable) {
  if (typeof iterable === "string" || Array.isArray(iterable)) {
    return iterable.length;
  }
  if (iterable instanceof Set || iterable instanceof Map) {
    return iterable.size;
  }
  const iterator = iterable[Symbol.iterator]();
  let result = -1;
  for (let done = false; !done; result += 1) {
    done = Boolean(iterator.next().done);
  }
  return result;
}
function concat(...iterables) {
  return new ConcatIterable(iterables);
}
class ConcatIterable {
  constructor(iterables) {
    this.iterables = iterables;
  }
  *[Symbol.iterator]() {
    for (const iterable of this.iterables) {
      yield* iterable;
    }
  }
}
function every(iterable, predicate) {
  for (const value of iterable) {
    if (!predicate(value)) {
      return false;
    }
  }
  return true;
}
function filter(iterable, predicate) {
  return new FilterIterable(iterable, predicate);
}
class FilterIterable {
  constructor(iterable, predicate) {
    this.iterable = iterable;
    this.predicate = predicate;
  }
  [Symbol.iterator]() {
    return new FilterIterator(this.iterable[Symbol.iterator](), this.predicate);
  }
}
class FilterIterator {
  constructor(iterator, predicate) {
    this.iterator = iterator;
    this.predicate = predicate;
  }
  next() {
    while (true) {
      const nextIteration = this.iterator.next();
      if (nextIteration.done || this.predicate(nextIteration.value)) {
        return nextIteration;
      }
    }
  }
}
function collect(iterable, fn) {
  return new CollectIterable(iterable, fn);
}
class CollectIterable {
  constructor(iterable, fn) {
    this.iterable = iterable;
    this.fn = fn;
  }
  [Symbol.iterator]() {
    return new CollectIterator(this.iterable[Symbol.iterator](), this.fn);
  }
}
class CollectIterator {
  constructor(iterator, fn) {
    this.iterator = iterator;
    this.fn = fn;
  }
  next() {
    while (true) {
      const nextIteration = this.iterator.next();
      if (nextIteration.done)
        return nextIteration;
      const nextValue = this.fn(nextIteration.value);
      if (nextValue !== void 0) {
        return {
          done: false,
          value: nextValue
        };
      }
    }
  }
}
function find(iterable, predicate) {
  for (const value of iterable) {
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
function groupBy(iterable, fn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const value of iterable) {
    const key = fn(value);
    const existingGroup = (0, import_getOwn.getOwn)(result, key);
    if (existingGroup) {
      existingGroup.push(value);
    } else {
      result[key] = [value];
    }
  }
  return result;
}
const isEmpty = /* @__PURE__ */ __name((iterable) => Boolean(iterable[Symbol.iterator]().next().done), "isEmpty");
function join(iterable, separator) {
  let hasProcessedFirst = false;
  let result = "";
  for (const value of iterable) {
    const stringifiedValue = value == null ? "" : String(value);
    if (hasProcessedFirst) {
      result += separator + stringifiedValue;
    } else {
      result = stringifiedValue;
    }
    hasProcessedFirst = true;
  }
  return result;
}
function map(iterable, fn) {
  return new MapIterable(iterable, fn);
}
class MapIterable {
  constructor(iterable, fn) {
    this.iterable = iterable;
    this.fn = fn;
  }
  [Symbol.iterator]() {
    return new MapIterator(this.iterable[Symbol.iterator](), this.fn);
  }
}
class MapIterator {
  constructor(iterator, fn) {
    this.iterator = iterator;
    this.fn = fn;
  }
  next() {
    const nextIteration = this.iterator.next();
    if (nextIteration.done) {
      return nextIteration;
    }
    return {
      done: false,
      value: this.fn(nextIteration.value)
    };
  }
}
function reduce(iterable, fn, accumulator) {
  let result = accumulator;
  for (const value of iterable) {
    result = fn(result, value);
  }
  return result;
}
function repeat(value) {
  return new RepeatIterable(value);
}
class RepeatIterable {
  constructor(value) {
    this.value = value;
  }
  [Symbol.iterator]() {
    return new RepeatIterator(this.value);
  }
}
class RepeatIterator {
  constructor(value) {
    this.iteratorResult = {
      done: false,
      value
    };
  }
  next() {
    return this.iteratorResult;
  }
}
function take(iterable, amount) {
  return new TakeIterable(iterable, amount);
}
class TakeIterable {
  constructor(iterable, amount) {
    this.iterable = iterable;
    this.amount = amount;
  }
  [Symbol.iterator]() {
    return new TakeIterator(this.iterable[Symbol.iterator](), this.amount);
  }
}
class TakeIterator {
  constructor(iterator, amount) {
    this.iterator = iterator;
    this.amount = amount;
  }
  next() {
    const nextIteration = this.iterator.next();
    if (nextIteration.done || this.amount === 0) {
      return { done: true, value: void 0 };
    }
    this.amount -= 1;
    return nextIteration;
  }
}
function zipObject(props, values) {
  const result = {};
  const propsIterator = props[Symbol.iterator]();
  const valuesIterator = values[Symbol.iterator]();
  while (true) {
    const propIteration = propsIterator.next();
    if (propIteration.done) {
      break;
    }
    const valueIteration = valuesIterator.next();
    if (valueIteration.done) {
      break;
    }
    result[propIteration.value] = valueIteration.value;
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collect,
  concat,
  every,
  filter,
  find,
  groupBy,
  isEmpty,
  isIterable,
  join,
  map,
  reduce,
  repeat,
  size,
  take,
  zipObject
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaXRlcmFibGVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDb3B5cmlnaHQgMjAyMS0yMDIyIFNpZ25hbCBNZXNzZW5nZXIsIExMQ1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFHUEwtMy4wLW9ubHlcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cblxuaW1wb3J0IHsgZ2V0T3duIH0gZnJvbSAnLi9nZXRPd24nO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIEl0ZXJhYmxlPHVua25vd24+IHtcbiAgcmV0dXJuIChcbiAgICAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gdmFsdWUpIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2l6ZShpdGVyYWJsZTogSXRlcmFibGU8dW5rbm93bj4pOiBudW1iZXIge1xuICAvLyBXZSBjaGVjayBmb3IgY29tbW9uIHR5cGVzIGFzIGFuIG9wdGltaXphdGlvbi5cbiAgaWYgKHR5cGVvZiBpdGVyYWJsZSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShpdGVyYWJsZSkpIHtcbiAgICByZXR1cm4gaXRlcmFibGUubGVuZ3RoO1xuICB9XG4gIGlmIChpdGVyYWJsZSBpbnN0YW5jZW9mIFNldCB8fCBpdGVyYWJsZSBpbnN0YW5jZW9mIE1hcCkge1xuICAgIHJldHVybiBpdGVyYWJsZS5zaXplO1xuICB9XG5cbiAgY29uc3QgaXRlcmF0b3IgPSBpdGVyYWJsZVtTeW1ib2wuaXRlcmF0b3JdKCk7XG5cbiAgbGV0IHJlc3VsdCA9IC0xO1xuICBmb3IgKGxldCBkb25lID0gZmFsc2U7ICFkb25lOyByZXN1bHQgKz0gMSkge1xuICAgIGRvbmUgPSBCb29sZWFuKGl0ZXJhdG9yLm5leHQoKS5kb25lKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQ+KFxuICAuLi5pdGVyYWJsZXM6IFJlYWRvbmx5QXJyYXk8SXRlcmFibGU8VD4+XG4pOiBJdGVyYWJsZTxUPiB7XG4gIHJldHVybiBuZXcgQ29uY2F0SXRlcmFibGUoaXRlcmFibGVzKTtcbn1cblxuY2xhc3MgQ29uY2F0SXRlcmFibGU8VD4gaW1wbGVtZW50cyBJdGVyYWJsZTxUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaXRlcmFibGVzOiBSZWFkb25seUFycmF5PEl0ZXJhYmxlPFQ+Pikge31cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8VD4ge1xuICAgIGZvciAoY29uc3QgaXRlcmFibGUgb2YgdGhpcy5pdGVyYWJsZXMpIHtcbiAgICAgIHlpZWxkKiBpdGVyYWJsZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZXJ5PFQ+KFxuICBpdGVyYWJsZTogSXRlcmFibGU8VD4sXG4gIHByZWRpY2F0ZTogKHZhbHVlOiBUKSA9PiBib29sZWFuXG4pOiBib29sZWFuIHtcbiAgZm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuICAgIGlmICghcHJlZGljYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcjxULCBTIGV4dGVuZHMgVD4oXG4gIGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgcHJlZGljYXRlOiAodmFsdWU6IFQpID0+IHZhbHVlIGlzIFNcbik6IEl0ZXJhYmxlPFM+O1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcjxUPihcbiAgaXRlcmFibGU6IEl0ZXJhYmxlPFQ+LFxuICBwcmVkaWNhdGU6ICh2YWx1ZTogVCkgPT4gdW5rbm93blxuKTogSXRlcmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyPFQ+KFxuICBpdGVyYWJsZTogSXRlcmFibGU8VD4sXG4gIHByZWRpY2F0ZTogKHZhbHVlOiBUKSA9PiB1bmtub3duXG4pOiBJdGVyYWJsZTxUPiB7XG4gIHJldHVybiBuZXcgRmlsdGVySXRlcmFibGUoaXRlcmFibGUsIHByZWRpY2F0ZSk7XG59XG5cbmNsYXNzIEZpbHRlckl0ZXJhYmxlPFQ+IGltcGxlbWVudHMgSXRlcmFibGU8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByZWRpY2F0ZTogKHZhbHVlOiBUKSA9PiB1bmtub3duXG4gICkge31cblxuICBbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxUPiB7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJdGVyYXRvcih0aGlzLml0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKSwgdGhpcy5wcmVkaWNhdGUpO1xuICB9XG59XG5cbmNsYXNzIEZpbHRlckl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgSXRlcmF0b3I8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZXJhdG9yOiBJdGVyYXRvcjxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByZWRpY2F0ZTogKHZhbHVlOiBUKSA9PiB1bmtub3duXG4gICkge31cblxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IG5leHRJdGVyYXRpb24gPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICAgIGlmIChuZXh0SXRlcmF0aW9uLmRvbmUgfHwgdGhpcy5wcmVkaWNhdGUobmV4dEl0ZXJhdGlvbi52YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG5leHRJdGVyYXRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRmlsdGVyIGFuZCB0cmFuc2Zvcm0gKG1hcCkgdGhhdCBwcm9kdWNlcyBhIG5ldyB0eXBlXG4gKiB1c2VmdWwgd2hlbiB0cmF2ZXJzaW5nIHRocm91Z2ggZmllbGRzIHRoYXQgbWlnaHQgYmUgdW5kZWZpbmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xsZWN0PFQsIFM+KFxuICBpdGVyYWJsZTogSXRlcmFibGU8VD4sXG4gIGZuOiAodmFsdWU6IFQpID0+IFMgfCB1bmRlZmluZWRcbik6IEl0ZXJhYmxlPFM+IHtcbiAgcmV0dXJuIG5ldyBDb2xsZWN0SXRlcmFibGUoaXRlcmFibGUsIGZuKTtcbn1cblxuY2xhc3MgQ29sbGVjdEl0ZXJhYmxlPFQsIFM+IGltcGxlbWVudHMgSXRlcmFibGU8Uz4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZuOiAodmFsdWU6IFQpID0+IFMgfCB1bmRlZmluZWRcbiAgKSB7fVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFM+IHtcbiAgICByZXR1cm4gbmV3IENvbGxlY3RJdGVyYXRvcih0aGlzLml0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKSwgdGhpcy5mbik7XG4gIH1cbn1cblxuY2xhc3MgQ29sbGVjdEl0ZXJhdG9yPFQsIFM+IGltcGxlbWVudHMgSXRlcmF0b3I8Uz4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZXJhdG9yOiBJdGVyYXRvcjxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZuOiAodmFsdWU6IFQpID0+IFMgfCB1bmRlZmluZWRcbiAgKSB7fVxuXG4gIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8Uz4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zdGFudC1jb25kaXRpb25cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgbmV4dEl0ZXJhdGlvbiA9IHRoaXMuaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKG5leHRJdGVyYXRpb24uZG9uZSkgcmV0dXJuIG5leHRJdGVyYXRpb247XG4gICAgICBjb25zdCBuZXh0VmFsdWUgPSB0aGlzLmZuKG5leHRJdGVyYXRpb24udmFsdWUpO1xuICAgICAgaWYgKG5leHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IG5leHRWYWx1ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmQ8VD4oXG4gIGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgcHJlZGljYXRlOiAodmFsdWU6IFQpID0+IHVua25vd25cbik6IHVuZGVmaW5lZCB8IFQge1xuICBmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VD4oXG4gIGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgZm46ICh2YWx1ZTogVCkgPT4gc3RyaW5nXG4pOiBSZWNvcmQ8c3RyaW5nLCBBcnJheTxUPj4ge1xuICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIEFycmF5PFQ+PiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAoY29uc3QgdmFsdWUgb2YgaXRlcmFibGUpIHtcbiAgICBjb25zdCBrZXkgPSBmbih2YWx1ZSk7XG4gICAgY29uc3QgZXhpc3RpbmdHcm91cCA9IGdldE93bihyZXN1bHQsIGtleSk7XG4gICAgaWYgKGV4aXN0aW5nR3JvdXApIHtcbiAgICAgIGV4aXN0aW5nR3JvdXAucHVzaCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGNvbnN0IGlzRW1wdHkgPSAoaXRlcmFibGU6IEl0ZXJhYmxlPHVua25vd24+KTogYm9vbGVhbiA9PlxuICBCb29sZWFuKGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKS5uZXh0KCkuZG9uZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBqb2luKGl0ZXJhYmxlOiBJdGVyYWJsZTx1bmtub3duPiwgc2VwYXJhdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgaGFzUHJvY2Vzc2VkRmlyc3QgPSBmYWxzZTtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG4gICAgY29uc3Qgc3RyaW5naWZpZWRWYWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IFN0cmluZyh2YWx1ZSk7XG4gICAgaWYgKGhhc1Byb2Nlc3NlZEZpcnN0KSB7XG4gICAgICByZXN1bHQgKz0gc2VwYXJhdG9yICsgc3RyaW5naWZpZWRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gc3RyaW5naWZpZWRWYWx1ZTtcbiAgICB9XG4gICAgaGFzUHJvY2Vzc2VkRmlyc3QgPSB0cnVlO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXA8VCwgUmVzdWx0VD4oXG4gIGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgZm46ICh2YWx1ZTogVCkgPT4gUmVzdWx0VFxuKTogSXRlcmFibGU8UmVzdWx0VD4ge1xuICByZXR1cm4gbmV3IE1hcEl0ZXJhYmxlKGl0ZXJhYmxlLCBmbik7XG59XG5cbmNsYXNzIE1hcEl0ZXJhYmxlPFQsIFJlc3VsdFQ+IGltcGxlbWVudHMgSXRlcmFibGU8UmVzdWx0VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZXJhYmxlOiBJdGVyYWJsZTxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZuOiAodmFsdWU6IFQpID0+IFJlc3VsdFRcbiAgKSB7fVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFJlc3VsdFQ+IHtcbiAgICByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMuaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpLCB0aGlzLmZuKTtcbiAgfVxufVxuXG5jbGFzcyBNYXBJdGVyYXRvcjxULCBSZXN1bHRUPiBpbXBsZW1lbnRzIEl0ZXJhdG9yPFJlc3VsdFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBpdGVyYXRvcjogSXRlcmF0b3I8VD4sXG4gICAgcHJpdmF0ZSByZWFkb25seSBmbjogKHZhbHVlOiBUKSA9PiBSZXN1bHRUXG4gICkge31cblxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFJlc3VsdFQ+IHtcbiAgICBjb25zdCBuZXh0SXRlcmF0aW9uID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgaWYgKG5leHRJdGVyYXRpb24uZG9uZSkge1xuICAgICAgcmV0dXJuIG5leHRJdGVyYXRpb247XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBkb25lOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB0aGlzLmZuKG5leHRJdGVyYXRpb24udmFsdWUpLFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZTxULCBUUmVzdWx0PihcbiAgaXRlcmFibGU6IEl0ZXJhYmxlPFQ+LFxuICBmbjogKHJlc3VsdDogVFJlc3VsdCwgdmFsdWU6IFQpID0+IFRSZXN1bHQsXG4gIGFjY3VtdWxhdG9yOiBUUmVzdWx0XG4pOiBUUmVzdWx0IHtcbiAgbGV0IHJlc3VsdCA9IGFjY3VtdWxhdG9yO1xuICBmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG4gICAgcmVzdWx0ID0gZm4ocmVzdWx0LCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdDxUPih2YWx1ZTogVCk6IEl0ZXJhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBSZXBlYXRJdGVyYWJsZSh2YWx1ZSk7XG59XG5cbmNsYXNzIFJlcGVhdEl0ZXJhYmxlPFQ+IGltcGxlbWVudHMgSXRlcmFibGU8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHZhbHVlOiBUKSB7fVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4gbmV3IFJlcGVhdEl0ZXJhdG9yKHRoaXMudmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIFJlcGVhdEl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIHJlYWRvbmx5IGl0ZXJhdG9yUmVzdWx0OiBJdGVyYXRvclJlc3VsdDxUPjtcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogUmVhZG9ubHk8VD4pIHtcbiAgICB0aGlzLml0ZXJhdG9yUmVzdWx0ID0ge1xuICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB2YWx1ZSxcbiAgICB9O1xuICB9XG5cbiAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0b3JSZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRha2U8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQ+LCBhbW91bnQ6IG51bWJlcik6IEl0ZXJhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBUYWtlSXRlcmFibGUoaXRlcmFibGUsIGFtb3VudCk7XG59XG5cbmNsYXNzIFRha2VJdGVyYWJsZTxUPiBpbXBsZW1lbnRzIEl0ZXJhYmxlPFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBpdGVyYWJsZTogSXRlcmFibGU8VD4sXG4gICAgcHJpdmF0ZSByZWFkb25seSBhbW91bnQ6IG51bWJlclxuICApIHt9XG5cbiAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8VD4ge1xuICAgIHJldHVybiBuZXcgVGFrZUl0ZXJhdG9yKHRoaXMuaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpLCB0aGlzLmFtb3VudCk7XG4gIH1cbn1cblxuY2xhc3MgVGFrZUl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgSXRlcmF0b3I8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgcHJpdmF0ZSBhbW91bnQ6IG51bWJlcikge31cblxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICBjb25zdCBuZXh0SXRlcmF0aW9uID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgaWYgKG5leHRJdGVyYXRpb24uZG9uZSB8fCB0aGlzLmFtb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuICAgIH1cbiAgICB0aGlzLmFtb3VudCAtPSAxO1xuICAgIHJldHVybiBuZXh0SXRlcmF0aW9uO1xuICB9XG59XG5cbi8vIEluIHRoZSBmdXR1cmUsIHRoaXMgY291bGQgc3VwcG9ydCBudW1iZXIgYW5kIHN5bWJvbCBwcm9wZXJ0eSBuYW1lcy5cbmV4cG9ydCBmdW5jdGlvbiB6aXBPYmplY3Q8VmFsdWVUPihcbiAgcHJvcHM6IEl0ZXJhYmxlPHN0cmluZz4sXG4gIHZhbHVlczogSXRlcmFibGU8VmFsdWVUPlxuKTogUmVjb3JkPHN0cmluZywgVmFsdWVUPiB7XG4gIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgVmFsdWVUPiA9IHt9O1xuXG4gIGNvbnN0IHByb3BzSXRlcmF0b3IgPSBwcm9wc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIGNvbnN0IHZhbHVlc0l0ZXJhdG9yID0gdmFsdWVzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGNvbnN0IHByb3BJdGVyYXRpb24gPSBwcm9wc0l0ZXJhdG9yLm5leHQoKTtcbiAgICBpZiAocHJvcEl0ZXJhdGlvbi5kb25lKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc3QgdmFsdWVJdGVyYXRpb24gPSB2YWx1ZXNJdGVyYXRvci5uZXh0KCk7XG4gICAgaWYgKHZhbHVlSXRlcmF0aW9uLmRvbmUpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJlc3VsdFtwcm9wSXRlcmF0aW9uLnZhbHVlXSA9IHZhbHVlSXRlcmF0aW9uLnZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0Esb0JBQXVCO0FBRWhCLG9CQUFvQixPQUE0QztBQUNyRSxTQUNHLE9BQU8sVUFBVSxZQUFZLFVBQVUsUUFBUSxPQUFPLFlBQVksU0FDbkUsT0FBTyxVQUFVO0FBRXJCO0FBTGdCLEFBT1QsY0FBYyxVQUFxQztBQUV4RCxNQUFJLE9BQU8sYUFBYSxZQUFZLE1BQU0sUUFBUSxRQUFRLEdBQUc7QUFDM0QsV0FBTyxTQUFTO0FBQUEsRUFDbEI7QUFDQSxNQUFJLG9CQUFvQixPQUFPLG9CQUFvQixLQUFLO0FBQ3RELFdBQU8sU0FBUztBQUFBLEVBQ2xCO0FBRUEsUUFBTSxXQUFXLFNBQVMsT0FBTyxVQUFVO0FBRTNDLE1BQUksU0FBUztBQUNiLFdBQVMsT0FBTyxPQUFPLENBQUMsTUFBTSxVQUFVLEdBQUc7QUFDekMsV0FBTyxRQUFRLFNBQVMsS0FBSyxFQUFFLElBQUk7QUFBQSxFQUNyQztBQUNBLFNBQU87QUFDVDtBQWhCZ0IsQUFrQlQsbUJBQ0YsV0FDVTtBQUNiLFNBQU8sSUFBSSxlQUFlLFNBQVM7QUFDckM7QUFKZ0IsQUFNaEIsTUFBTSxlQUF5QztBQUFBLEVBQzdDLFlBQTZCLFdBQXVDO0FBQXZDO0FBQUEsRUFBd0M7QUFBQSxJQUVuRSxPQUFPLFlBQXlCO0FBQ2hDLGVBQVcsWUFBWSxLQUFLLFdBQVc7QUFDckMsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0Y7QUFSQSxBQVVPLGVBQ0wsVUFDQSxXQUNTO0FBQ1QsYUFBVyxTQUFTLFVBQVU7QUFDNUIsUUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHO0FBQ3JCLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNBLFNBQU87QUFDVDtBQVZnQixBQW9CVCxnQkFDTCxVQUNBLFdBQ2E7QUFDYixTQUFPLElBQUksZUFBZSxVQUFVLFNBQVM7QUFDL0M7QUFMZ0IsQUFPaEIsTUFBTSxlQUF5QztBQUFBLEVBQzdDLFlBQ21CLFVBQ0EsV0FDakI7QUFGaUI7QUFDQTtBQUFBLEVBQ2hCO0FBQUEsR0FFRixPQUFPLFlBQXlCO0FBQy9CLFdBQU8sSUFBSSxlQUFlLEtBQUssU0FBUyxPQUFPLFVBQVUsR0FBRyxLQUFLLFNBQVM7QUFBQSxFQUM1RTtBQUNGO0FBVEEsQUFXQSxNQUFNLGVBQXlDO0FBQUEsRUFDN0MsWUFDbUIsVUFDQSxXQUNqQjtBQUZpQjtBQUNBO0FBQUEsRUFDaEI7QUFBQSxFQUVILE9BQTBCO0FBRXhCLFdBQU8sTUFBTTtBQUNYLFlBQU0sZ0JBQWdCLEtBQUssU0FBUyxLQUFLO0FBQ3pDLFVBQUksY0FBYyxRQUFRLEtBQUssVUFBVSxjQUFjLEtBQUssR0FBRztBQUM3RCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFmQSxBQXFCTyxpQkFDTCxVQUNBLElBQ2E7QUFDYixTQUFPLElBQUksZ0JBQWdCLFVBQVUsRUFBRTtBQUN6QztBQUxnQixBQU9oQixNQUFNLGdCQUE2QztBQUFBLEVBQ2pELFlBQ21CLFVBQ0EsSUFDakI7QUFGaUI7QUFDQTtBQUFBLEVBQ2hCO0FBQUEsR0FFRixPQUFPLFlBQXlCO0FBQy9CLFdBQU8sSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLE9BQU8sVUFBVSxHQUFHLEtBQUssRUFBRTtBQUFBLEVBQ3RFO0FBQ0Y7QUFUQSxBQVdBLE1BQU0sZ0JBQTZDO0FBQUEsRUFDakQsWUFDbUIsVUFDQSxJQUNqQjtBQUZpQjtBQUNBO0FBQUEsRUFDaEI7QUFBQSxFQUVILE9BQTBCO0FBRXhCLFdBQU8sTUFBTTtBQUNYLFlBQU0sZ0JBQWdCLEtBQUssU0FBUyxLQUFLO0FBQ3pDLFVBQUksY0FBYztBQUFNLGVBQU87QUFDL0IsWUFBTSxZQUFZLEtBQUssR0FBRyxjQUFjLEtBQUs7QUFDN0MsVUFBSSxjQUFjLFFBQVc7QUFDM0IsZUFBTztBQUFBLFVBQ0wsTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQXBCQSxBQXNCTyxjQUNMLFVBQ0EsV0FDZTtBQUNmLGFBQVcsU0FBUyxVQUFVO0FBQzVCLFFBQUksVUFBVSxLQUFLLEdBQUc7QUFDcEIsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNUO0FBVmdCLEFBWVQsaUJBQ0wsVUFDQSxJQUMwQjtBQUMxQixRQUFNLFNBQW1DLHVCQUFPLE9BQU8sSUFBSTtBQUMzRCxhQUFXLFNBQVMsVUFBVTtBQUM1QixVQUFNLE1BQU0sR0FBRyxLQUFLO0FBQ3BCLFVBQU0sZ0JBQWdCLDBCQUFPLFFBQVEsR0FBRztBQUN4QyxRQUFJLGVBQWU7QUFDakIsb0JBQWMsS0FBSyxLQUFLO0FBQUEsSUFDMUIsT0FBTztBQUNMLGFBQU8sT0FBTyxDQUFDLEtBQUs7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQ1Q7QUFmZ0IsQUFpQlQsTUFBTSxVQUFVLHdCQUFDLGFBQ3RCLFFBQVEsU0FBUyxPQUFPLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxHQUQxQjtBQUdoQixjQUFjLFVBQTZCLFdBQTJCO0FBQzNFLE1BQUksb0JBQW9CO0FBQ3hCLE1BQUksU0FBUztBQUNiLGFBQVcsU0FBUyxVQUFVO0FBQzVCLFVBQU0sbUJBQW1CLFNBQVMsT0FBTyxLQUFLLE9BQU8sS0FBSztBQUMxRCxRQUFJLG1CQUFtQjtBQUNyQixnQkFBVSxZQUFZO0FBQUEsSUFDeEIsT0FBTztBQUNMLGVBQVM7QUFBQSxJQUNYO0FBQ0Esd0JBQW9CO0FBQUEsRUFDdEI7QUFDQSxTQUFPO0FBQ1Q7QUFiZ0IsQUFlVCxhQUNMLFVBQ0EsSUFDbUI7QUFDbkIsU0FBTyxJQUFJLFlBQVksVUFBVSxFQUFFO0FBQ3JDO0FBTGdCLEFBT2hCLE1BQU0sWUFBcUQ7QUFBQSxFQUN6RCxZQUNtQixVQUNBLElBQ2pCO0FBRmlCO0FBQ0E7QUFBQSxFQUNoQjtBQUFBLEdBRUYsT0FBTyxZQUErQjtBQUNyQyxXQUFPLElBQUksWUFBWSxLQUFLLFNBQVMsT0FBTyxVQUFVLEdBQUcsS0FBSyxFQUFFO0FBQUEsRUFDbEU7QUFDRjtBQVRBLEFBV0EsTUFBTSxZQUFxRDtBQUFBLEVBQ3pELFlBQ21CLFVBQ0EsSUFDakI7QUFGaUI7QUFDQTtBQUFBLEVBQ2hCO0FBQUEsRUFFSCxPQUFnQztBQUM5QixVQUFNLGdCQUFnQixLQUFLLFNBQVMsS0FBSztBQUN6QyxRQUFJLGNBQWMsTUFBTTtBQUN0QixhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU87QUFBQSxNQUNMLE1BQU07QUFBQSxNQUNOLE9BQU8sS0FBSyxHQUFHLGNBQWMsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUNGO0FBaEJBLEFBa0JPLGdCQUNMLFVBQ0EsSUFDQSxhQUNTO0FBQ1QsTUFBSSxTQUFTO0FBQ2IsYUFBVyxTQUFTLFVBQVU7QUFDNUIsYUFBUyxHQUFHLFFBQVEsS0FBSztBQUFBLEVBQzNCO0FBQ0EsU0FBTztBQUNUO0FBVmdCLEFBWVQsZ0JBQW1CLE9BQXVCO0FBQy9DLFNBQU8sSUFBSSxlQUFlLEtBQUs7QUFDakM7QUFGZ0IsQUFJaEIsTUFBTSxlQUF5QztBQUFBLEVBQzdDLFlBQTZCLE9BQVU7QUFBVjtBQUFBLEVBQVc7QUFBQSxHQUV2QyxPQUFPLFlBQXlCO0FBQy9CLFdBQU8sSUFBSSxlQUFlLEtBQUssS0FBSztBQUFBLEVBQ3RDO0FBQ0Y7QUFOQSxBQVFBLE1BQU0sZUFBeUM7QUFBQSxFQUc3QyxZQUFZLE9BQW9CO0FBQzlCLFNBQUssaUJBQWlCO0FBQUEsTUFDcEIsTUFBTTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsT0FBMEI7QUFDeEIsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUNGO0FBYkEsQUFlTyxjQUFpQixVQUF1QixRQUE2QjtBQUMxRSxTQUFPLElBQUksYUFBYSxVQUFVLE1BQU07QUFDMUM7QUFGZ0IsQUFJaEIsTUFBTSxhQUF1QztBQUFBLEVBQzNDLFlBQ21CLFVBQ0EsUUFDakI7QUFGaUI7QUFDQTtBQUFBLEVBQ2hCO0FBQUEsR0FFRixPQUFPLFlBQXlCO0FBQy9CLFdBQU8sSUFBSSxhQUFhLEtBQUssU0FBUyxPQUFPLFVBQVUsR0FBRyxLQUFLLE1BQU07QUFBQSxFQUN2RTtBQUNGO0FBVEEsQUFXQSxNQUFNLGFBQXVDO0FBQUEsRUFDM0MsWUFBNkIsVUFBK0IsUUFBZ0I7QUFBL0M7QUFBK0I7QUFBQSxFQUFpQjtBQUFBLEVBRTdFLE9BQTBCO0FBQ3hCLFVBQU0sZ0JBQWdCLEtBQUssU0FBUyxLQUFLO0FBQ3pDLFFBQUksY0FBYyxRQUFRLEtBQUssV0FBVyxHQUFHO0FBQzNDLGFBQU8sRUFBRSxNQUFNLE1BQU0sT0FBTyxPQUFVO0FBQUEsSUFDeEM7QUFDQSxTQUFLLFVBQVU7QUFDZixXQUFPO0FBQUEsRUFDVDtBQUNGO0FBWEEsQUFjTyxtQkFDTCxPQUNBLFFBQ3dCO0FBQ3hCLFFBQU0sU0FBaUMsQ0FBQztBQUV4QyxRQUFNLGdCQUFnQixNQUFNLE9BQU8sVUFBVTtBQUM3QyxRQUFNLGlCQUFpQixPQUFPLE9BQU8sVUFBVTtBQUUvQyxTQUFPLE1BQU07QUFDWCxVQUFNLGdCQUFnQixjQUFjLEtBQUs7QUFDekMsUUFBSSxjQUFjLE1BQU07QUFDdEI7QUFBQSxJQUNGO0FBQ0EsVUFBTSxpQkFBaUIsZUFBZSxLQUFLO0FBQzNDLFFBQUksZUFBZSxNQUFNO0FBQ3ZCO0FBQUEsSUFDRjtBQUVBLFdBQU8sY0FBYyxTQUFTLGVBQWU7QUFBQSxFQUMvQztBQUVBLFNBQU87QUFDVDtBQXZCZ0IiLAogICJuYW1lcyI6IFtdCn0K
