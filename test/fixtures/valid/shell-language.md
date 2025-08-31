# Valid Shell Language Usage

This document demonstrates correct shell language standardization.

## Correct Shell Usage

Use `shell` for shell commands:

```shell
echo "Hello World"
ls -la
cd /home/user
```

## Other Languages Are Fine

Python code is fine:

```python
print("Hello World")
```

JavaScript is fine:

```javascript
console.log("Hello World");
```

## Mixed Content

```shell
#!/bin/bash
# This is still shell, which is correct
echo "Commands here"
```

## No Language Specified

This is also fine:

```shell
echo "No language specified"
```
