# DLint

![](https://github.com/fujiharuka/dlint/workflows/all%20packages/badge.svg)

JavaScript / TypeScript プロジェクトのためのレイヤー間依存関係を管理する Linter。

## Motivation

保守性の高いコードを書くには、モジュールを関心ごとに分割して、クリーンな依存関係を保つことが大切です。レイヤードアーキテクチャを始めとした DDD のさまざまなアーキテクチャは、細かい違いを無視すれば、同じことを言っています。モジュールをレイヤーで区切り、ドメイン知識を一つのレイヤーにまとめるということです。ドメイン知識を凝集したレイヤーは他のレイヤーに依存せず、逆に他のレイヤーがそのレイヤーに依存します。

これは素晴らしいアイデアだし、うまくいきそうな気がします。しかし、レイヤー間の依存関係をクリーンに保つには実装者が気遣ってあげなければなりません。ある日、ちょっとしたコード変更のつもりでコードベースにコミットしたら、意図せずレイヤーの依存関係が壊れてしまうかもしれません。

そうした事故を防ぐために、レイヤー間の依存関係ルールをあらかじめ設定しておいて、コードの静的解析によってレイヤー間の依存関係を保証すると便利です。これが DLint のモチベーションです。DLint を使えば、コードベース内のモジュールをレイヤーでまとめ、レイヤー間の依存関係ルールを定義し、コードの依存関係がルール通りになっているかどうかをチェックできます。

## Installation

```
$ npm install dlint -g
```

## Usage

DLint は CLI を提供しています。`dlint` コマンドは、設定ファイル `dlint-rules.yml` と一緒に使います。これはレイヤーとレイヤー間の依存関係ルールを定義した設定ファイルです。

例を見ましょう。今、以下のようなディレクトリ構成のプロジェクトを考えます。

```
.
├── controllers/
├── entities/
└── main.js
```

このプロジェクトルートに以下のような `dlint-rules.yml` を書きます。

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

`layers` フィールドは、レイヤーを定義しています。ここでは `entity`、`controller`、`main` の 3 つのレイヤーがあり、各レイヤーは [glob パターン](https://github.com/mrmlnc/fast-glob#pattern-syntax)で定義されます。たとえば `entity` レイヤーは `entities/` ディレクトリ以下にあるすべての `.js` ファイルが対象です。

`rules` フィールドは、各レイヤーの依存関係ルールを定義しています。依存関係ルールは配列であり、後のルールが前のルールを上書きします。たとえば、`controller` レイヤーのルールを見ましょう。

* `disallow: allLayers`
  * すべてのレイヤーに対しての依存を禁止する
* `disallow: allPackages`
  * すべてのパッケージへの依存を禁止する
* `allow: layers`
  * 指定したレイヤーへの依存を許可する。（最初の `disallow: allLayers` を上書きする）
  * ここでは `entity` レイヤーへの依存を許可している

依存の許可とは import 文 (と require 関数) が許可されるかどうかです。各レイヤーのルールを要約すると以下のとおりです。

* `entity` レイヤー: すべての import を禁止する
* `controller` レイヤー: `entity` レイヤーの import だけを許可します
* `main` レイヤー: すべての import を許可します

これで `dlint-rules.yml` が用意できました。コードがこの依存関係ルールに一致しているかどうかを確認するには、`dlint` コマンドを使います。

```
$ dlint
```

何も出力されなければ、valid な状態です。ルール違反があればエラーメッセージで教えてくれます。

## Rule file syntax

依存関係ルールファイル (デフォルトでは `dlint-rules.yml`) は構文に YAML を使います。

### `.layers`

**必須**。プロジェクト内をレイヤーで分割します。レイヤーごとに依存関係ルールを定義することになります。

### `.layers.<layer_name>`

各レイヤーに名前を与えます。レイヤー名は `rules` フィールドでレイヤーを指定するために使います。

値にはレイヤーに属するファイルパスの[glob パターン](https://github.com/mrmlnc/fast-glob#pattern-syntax) を文字の配列でセットします。ファイルパスはルールファイルからの相対パス、または `rootDir` からの相対パスです。

### `.rules`

**必須**。各レイヤーに適用する依存関係ルールをここに書きます。

### `.rules.<layer_name>`

名前で参照されたレイヤーに適用する依存関係ルールを配列でセットします。ルールは `allow: <target>` または `disallow: <target>` という形で、target によっては `on:` が必要な場合があります。後のルールが前のルールを上書きします。

例:

```yaml
- disallow: allLayers
- allow: layers
  on:
    - layer01
```

以下がルール対象の一覧です。

| target | on | 説明 |
|:---:|:---:|:---|
|all| - |すべてのレイヤーとパッケージ|
|allLayers| - |すべてのレイヤー|
|allPackages| - |すべてのパッケージ|
|allNodejs| - |すべての Node.js ビルトインパッケージ|
|allJson| - |すべての JSON ファイル|
|layers| **required** | `on` で指定したレイヤー |
|packages| **required** | `on` で指定したパッケージ |

### `.defaultRules`

任意。すべてのレイヤーに規定で適用されるルールを配列で指定します。

### `.ignorePatterns`

任意。レイヤーのファイルパターンで無視すべきものを glob パターンで指定します。

### `.parser`

任意。使用するパーサーのパッケージ名を指定します。サポートしているパッケージは [acorn](https://github.com/acornjs/acorn) と [@typescript-eslint/typescript-estree](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/typescript-estree) です。デフォルトでは `acorn` が使用されます。TypeScript には `@typescript-eslint/typescript-estree` を使用してください。

例

```yaml
parser: '@typescript-eslint/typescript-estree'
```

### `.rootDir`

任意。レイヤーのファイルパターンのルートディレクトリを指定します。デフォルトではルールファイルのあるディレクトリになります。

## Example

See [example/](./example).
