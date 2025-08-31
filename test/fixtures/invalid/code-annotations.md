# Invalid Code Annotations

## Wrong Comment Style in Python

```python
def example():
    print("Hello")  // (1)!  # Should use # not //
    return True  <!-- (2)! -->  # Should use # not HTML comments
    pass  -- (3)!  # Should use # not --
```

## Wrong Comment Style in JavaScript

```javascript
function test() {
    console.log("test");  # (1)!  // Should use // not #
    return false;  <!-- (2)! -->  // Should use // not HTML comments
}
```

## Wrong Comment Style in HTML

```html
<div class="container">  # (1)!  <!-- Should use <!-- --> not # -->
    <p>Content</p>  // (2)!  <!-- Should use <!-- --> not // -->
</div>
```

## Wrong Comment Style in Shell

```shell
echo "Hello"  // (1)!  # Should use # not //
cd /home  <!-- (2)! -->  # Should use # not HTML comments
```

## Wrong Comment Style in SQL

```sql
SELECT * FROM users  # (1)!  -- Should use -- not #
WHERE active = 1;  <!-- (2)! -->  -- Should use -- not HTML comments
```

## Wrong Comment Style in YAML

```yaml
server:
  port: 8080  // (1)!  # Should use # not //
database:
  host: localhost  <!-- (2)! -->  # Should use # not HTML comments
```