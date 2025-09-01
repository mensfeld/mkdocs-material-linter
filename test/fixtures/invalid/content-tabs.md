# Invalid Content Tabs

## Wrong Delimiter Count

== "Two Equals"
    Should use three equals signs.

==== "Four Equals"
    Should use three equals signs.

===== "Five Equals"
    Way too many equals signs.

## Missing Quotes

=== Tab Without Quotes
    Tab titles must be quoted.

=== Another Unquoted Tab
    This is also wrong.

## Empty Titles

=== ""
    Empty tab titles are not allowed.

=== "   "
    Whitespace-only titles are also invalid.

## Bad Indentation

=== "Proper Title"
  Content with only 2 spaces.

=== "Another Title"
        Content with 8 spaces instead of 4.

=== "Tab Title"
	Content using tabs instead of spaces.

## Very Long Tab Titles

=== "This is an extremely long tab title that exceeds the recommended character limit for better user experience"
    Long titles make navigation difficult.

=== "Another very long title that should be shortened for better UX and cleaner interface design"
    This title is also too long.

## Malformed Delimiters

== "Missing One Equal"
    Not enough equals signs.

===== "Too Many Equals" =====
    Wrong format entirely.

=== Partial "Quote Problem
    Unclosed quotes.

=== "Unclosed Quote
    Missing closing quote.