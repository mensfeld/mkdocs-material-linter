# Invalid Admonitions

## Invalid Types

!!! invalid
    This uses an unsupported admonition type.

!!! Note
    This type should be lowercase.

!!! DANGER
    This type should be lowercase.

!!! inform
    This is a typo for "info".

!!! warnng
    This is a typo for "warning".

## Invalid Indentation

!!! note
  This content has only 2 spaces instead of 4.

!!! tip
        This content has 8 spaces but should have 4.

!!! warning
	This content uses tabs instead of spaces.

!!! info
 Only 1 space indentation.

## Mixed Issues

!!! unknowntype
  Invalid type and wrong indentation.

!!! NOTE "Title"
	Uppercase type and tabs for indentation.

## Empty Title Issues

!!! note ""
    This has an empty title which should be removed.

!!! warning ""
    Another empty title example.