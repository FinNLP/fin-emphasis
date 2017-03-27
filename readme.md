# Fin-emphasis

Detecting emphasized tokens for the Fin natural language processor.

## What it detects

- Superlative adjectives: `greatest`,
 `biggest`, `fastest` ...etc.
- Superlative adverbs.
- Adverbs of emphasis: `audibly`, `surely`, `literally` ...etc.

## Installation

```
npm i --save fin-emphasis
```


## Usage

```typescript
import * as Fin from "finnlp";
import "fin-emphasis";

const sentence = "He was demonstrably wrong about being the biggest winner."
const instance = new Fin.Run(sentence);
const result = instance.emphasis();
console.log(result);

```

The above example would give:

```javascript
[
    [
        0,
        0,
        0,
        0,
        2.5, // emphasis on "wrong" caused by "demonstrably".
        0,
        0,
        0,
        1, // emphasis on "biggest" because it's a superlative adjective.
        0
    ]
]
```