---
title: setuptoolsの未来
date: 2021-07-22
tags: ["python", "packaging"]
categories: ["programming"]
---

[setuptools](https://setuptools.readthedocs.io/en/latest/)はPythonにおけるライブラリ配布のためのツールとして長らく利用されています。
配布物の作成方法は[PEP 517](https://www.python.org/dev/peps/pep-0517/)で標準化されpoetryやflitのようなツールが作成されています。
これらのツールはPEP 517に対して開発されてきたためpyproject.tomlでプロジェクトメタデータを記述しています。
しかしsetuptoolsはプロジェクトメタデータをsetup.py, setup.cfgに記述する方法をとっており、これらのファイルがまだ必要となっています。
これらのファイルが必要となる理由といつまで必要となるのか整理しました。

# `setup.cfg`

setuptoolsもPEP517に対応しているため以下のようなpyrproject.tomlを記述してwheelを作成できます。
(https://setuptools.readthedocs.io/en/latest/build_meta.html)

```
[build-system]
requires = ["wheel", "setuptools"]
build-backend = "setuptools.build_meta"
```

このときプロジェクトメタデータはsetup.cfgに記述することになるため、
setup.cfgとpyproject.tomlと設定ファイルが2つ必要になります。

しかしpoetryやflitといったパッケージングツールはpyproject.tomlにプロジェクトメタデータを記述するようになっています。
これらのツールもメタデータの記述方法はそれぞれ独自に決めているため細かな才があります。
とはいえ最終的には同じメタデータを生成するための情報なのでメタデータをpyroject.tomlに書くためのスキーマを定義するPEPが提案されています。

- pyproject.tomlにプロジェクトメタデータを記述するためのPEP
  - [PEP 621 -- Storing project metadata in pyproject.toml](https://www.python.org/dev/peps/pep-0621/)
  - [PEP 631 -- Dependency specification in pyproject.toml based on PEP 508](https://www.python.org/dev/peps/pep-0631/)

# `setup.py`

wheelを作成するにはsetup.pyは必要ありません。
しかし、setuptoolsの単体で依存ライブラリをインストールする機能である `develop` コマンドや editable install には `setup.py` が必要になります。
この場合、ただ `setup` 関数を呼ぶだけの `setup.py` を作成することになります。

```python
from setuptools import setup

setup()
```

pipのinstallコマンドで `--editable` (`-e`) オプションをつけるとeditableインストールとなります。

```
$ pip install -e .
```

editableインストールは通常のインストールとは異なり、実際にソースコードがsite-packages以下にコピーされません。
対象プロジェクトのメタデータへの参照(egg-link)と、編集中のディレクトリへの参照(pthファイル)がsite-packagesに作成されます。
また依存ライブラリもインストールされ、開発中のプロジェクトが擬似的にインストールされた状態となります。

なんだかんだで、pyproject.toml, setup.cfg, setup.py と3つもファイルが必要になってしまいます。
また、editableインストールはsetuptoolsでのみ利用可能で、pipというインストーラがsetuptoolsの実装に依存した機能を持っていることになります。
poetryやflitのようなパッケージングツールは同様の機能を独自に持っていますが、すでにeditableインストールについて標準化するPEPが挙げられています。

- editableインストールのためのPEP
  - [PEP 660 -- Editable installs for pyproject.toml based builds (wheel based)](https://www.python.org/dev/peps/pep-0660/) Accepted
  - [PEP 662 -- Editable installs via virtual wheels](https://www.python.org/dev/peps/pep-0662/) Rejected

# setup.cfgを使うツールたち

余談になりますが、setuptoolsがsetup.cfgを必要としなくなったとしても多くのツールがsetup.cfgを設定ファイルとして利用しています。
大抵のツールは setup.cfg が唯一の設定ファイルではありませんが(tox.iniも使える場合が多いでしょう)なるべく設定ファイルは減らしたいものです。
多くのツールがpyproject.tomlに対応してきていますが、flake8は(今の所)pyproject.tomlへ対応するつもりはないようです。
tomlパーサーが標準ライブラリでないことがネックのようですが今後どうなるでしょうか。

# まとめ

- 最終的にはsetuptoolsを使う場合でもpyproject.tomlだけで済むことになる
  - PEP517対応でsetup.pyはビルド時には必須ではなくなった
  - editableインストールのためにはsetup.pyがまだ必要だが PEP660 で解決されていく予定
  - setup.cfgに記述しているメタデータは PEP 621 への対応でpyproject.tomlに記述することになる予定
