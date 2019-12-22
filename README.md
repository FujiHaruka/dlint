# DLint

![](https://github.com/fujiharuka/dlint/workflows/all%20packages/badge.svg)

Linter about inter-layer dependencies for JavaScript / TypeScript projects.

## Motivation

If you want to keep your codebase maintenable, it's important to split the code into modules by concerns and keep dependencies clean. Layered Architecture and other variations in DDD (Domain-Driven Design) say the same thing when viewed as a whole. They group modules by layer. Modules representing domain knowledge are gathered into a single domain layer. The domain layer doesn't depend on other layers, but other layers depend on it.

That's a great idea. I love it. But there's one problem. Developers have to take care of inter-layer dependencies to keep them clean. Otherwise one day you may commit a small patch which unintentionally breaks the layer dependency structure.

You might want to ensure inter-layer dependecies to avoid such an accident. That's why I made DLint. DLint ensures inter-layer dependency with static code analysis. It enables to define layers and inter-layer dependency rules, and checks that the codebase follow the rules.

## Installation

```
$ npm install dlint -g
```

## Usage

DLint provides CLI. The `dlint` command is used with rule config file called `dlint-rules.yml`. This defines inter-layer dependency rules.

Show me an example. Here is a project with a directory structure as follows.

```
.
├── controllers/
├── entities/
└── main.js
```

Put `dlint-rules.yml` as follows on the project root.

```yaml
layers:
	entity:
		- entities/**/*.js
	controller:
		- controllers/**/*.js
	main:
		- main.js
rules:
	entity:
		- disallow: allLayers
		- disallow: allPackages
	controller:
		- disallow: allLayers
		- disallow: allPackages
		- allow: layers
			on:
			  - entity
	main:
		- allow: all
```

`layers` field defines layers. There are 3 layers (`entity`, `controller`, and `main`), and each layer is defined with [glob pattern](https://github.com/mrmlnc/fast-glob#pattern-syntax). For example, `entity` layer is composed of all `.js` files under `entities/` directory.

`rules` field defines dependency rules of layers. Dependency rules are array, and a next rule overrides previous rules. Let's see the rule of `controller`.

- `disallow: allLayers`
  - Disallow dependencies on all layers
- `disallow: allPackages`
  - Disallow dependencies on all packages
- `allow: layers`
  - Allow dependencies on the specific layers. (Overrides previous `disallow: allLayers` rule)
  - In this case, it alllows dependencies on `entity` layer.

Allowance of dependencies means whether "import" statements (and "require()" functions) are allowed. In short all layers says as follows.

- `entity` layers: Disallow all import statements
- `controller` layer: Allow import statements only from `entity` layer
- `main` layer: Allow all import statements

Now `dlint-rules.yml` is ready. Use `dlint` command to check that codes follows the dependency rules.

```
$ dlint
```

If the terminal prints nothing, it's OK. If there are any errors, the command will show error messages.

## Rule file syntax

TODO

## Usage

TODO

## Example

See [example/](./example).
