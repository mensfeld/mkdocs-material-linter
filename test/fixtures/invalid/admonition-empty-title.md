# Invalid Admonition Title Usage

This document demonstrates incorrect admonition title usage.

## Empty title with regular admonition

!!! note ""
    This should not have empty title

## Empty title with collapsible admonition

??? warning ""
    This should also not have empty title

## Empty title with expanded collapsible

???+ info ""
    This should not have empty title either

## Multiple violations

!!! tip ""
    First violation

??? danger ""
    Second violation

## Mixed valid and invalid

Valid:

!!! success "Good title"
    This is correct

Invalid:

!!! failure ""
    This should be flagged