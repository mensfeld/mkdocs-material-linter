# Test Empty Admonitions

This demonstrates the common issue where content is not properly indented.

## Problem Case 1: Content Not Indented

!!! note "Important Note"
This content is not indented so it won't be part of the admonition.
It will appear as regular text instead.

## Problem Case 2: Empty Admonition

!!! warning

## Problem Case 3: Collapsible Without Content

??? tip "Click to expand"

## Problem Case 4: Content With Wrong Indentation

!!! danger "Critical Issue"
  Only 2 spaces - needs 4 spaces minimum

## Valid Cases (Should Pass)

!!! success "Properly Formatted"
    This content is correctly indented with 4 spaces.
    
    Multiple paragraphs work too.

??? info "Collapsible with content"
    Hidden content properly indented.

!!! note
    Even without a title, content is properly indented.