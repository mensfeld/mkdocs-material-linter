# Invalid Shell Language Usage

This document demonstrates incorrect shell language usage that should be flagged.

## Using bash instead of shell

```bash
echo "This should use shell instead"
ls -la
```

## Using sh instead of shell

```sh
cd /home/user
pwd
```

## Multiple violations

First violation:

```bash
echo "First bash block"
```

Second violation:

```sh
echo "First sh block"
```

## Mixed with valid content

Valid shell usage:

```shell
echo "This is correct"
```

Invalid bash usage:

```bash
echo "This should be shell"
```

## Case sensitivity test

```BASH
echo "Uppercase should not be flagged (different language)"
```

```SH
echo "Uppercase should not be flagged (different language)"
```