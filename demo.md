# Material for MkDocs Demo

This file demonstrates what the linter catches.

## Valid Examples (These Pass)

!!! note "Valid admonition"
    Content with proper 4-space indentation.

??? tip "Collapsible block"
    Hidden content that expands.

???+ warning "Expanded by default"
    This starts visible.

=== "Tab 1"
    First tab content.

=== "Tab 2"
    Second tab content.

## Invalid Examples (These Fail)

!!! invalid "Wrong type"
    This admonition type doesn't exist.

!!! note
  Only 2 spaces - should be 4.

??? badtype "Wrong collapsible type"
    Invalid type for collapsible.

== "Wrong delimiter"
    Should use === not ==

```python
print("Hello")  // (1)!  # Wrong comment style for Python
```