# DLint

![](https://github.com/fujiharuka/dlint/workflows/all%20packages/badge.svg)

Linter about inter-module dependencies.

## Motivation

If you want to keep your codebase maintenable, it's important to split the code into modules by concerns and keep dependencies clean. Layered Architecture and other variations in DDD (Domain-Driven Design) say the same thing when viewed as a whole. They group modules by layer. Modules representing domain knowledge are gathered into a single domain layer. The domain layer doesn't depend on other layers, but other layers depend on it.

That's a great idea. I love it. But there's one problem. Developers have to take care of inter-layer dependencies to keep them clean. Otherwise one day you may commit a small patch which breaks the layer dependency structure.

You might want to ensure inter-layer dependecies to avoid such an accident. That's why I made DLint. DLint ensures inter-layer dependency with static code analysis. It enables to define layers and inter-layer dependency rules, and checks that the codebase follow the rules.

## Installation

```
$ npm install dlint
```

## Usage

TODO

## Examples

See [example/](./example).

## Development

```console
$ yarn install
```
