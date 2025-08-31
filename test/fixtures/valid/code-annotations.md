# Valid Code Annotations

## Python Code with Annotations

```python
def hello_world():
    print("Hello, World!")  # (1)!
    return "success"  # (2)!

# This is a regular comment, not an annotation
result = hello_world()  # (3)!
```

## JavaScript Code with Annotations

```javascript
function greetUser(name) {
    console.log(`Hello, ${name}!`);  // (1)!
    return true;  // (2)!
}

const user = "Alice";  // (3)!
greetUser(user);
```

## Shell Script with Annotations

```shell
#!/bin/bash
echo "Starting process"  # (1)!
cd /path/to/directory  # (2)!
./run-script.sh  # (3)!
```

## YAML Configuration with Annotations

```yaml
server:
  host: localhost  # (1)!
  port: 8080  # (2)!
database:
  url: postgresql://localhost/db  # (3)!
```

## HTML with Annotations

```html
<div class="container">  <!-- (1)! -->
    <h1>Welcome</h1>  <!-- (2)! -->
    <p>Content here</p>  <!-- (3)! -->
</div>
```

## SQL with Annotations

```sql
SELECT name, email  -- (1)!
FROM users  -- (2)!
WHERE active = true;  -- (3)!
```

## Code Without Annotations (Should be ignored)

```python
def simple_function():
    return "No annotations here"

# Regular comments are fine
print("This is normal code")
```
