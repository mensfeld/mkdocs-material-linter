# Valid Content Tabs

## Basic Tabs

=== "Option A"
    This is the content for option A.

    It can have multiple paragraphs.

=== "Option B"
    This is the content for option B.

    ```python
    print("Code in tabs works too")
    ```

=== "Option C"
    Third option with different content.

## Tabs with Code Examples

=== "Python"
    ```python
    def example():
        return "Hello from Python"

    result = example()
    print(result)
    ```

=== "JavaScript"
    ```javascript
    function example() {
        return "Hello from JavaScript";
    }

    const result = example();
    console.log(result);
    ```

=== "Go"
    ```go
    package main

    import "fmt"

    func main() {
        fmt.Println("Hello from Go")
    }
    ```

## Tabs with Complex Content

=== "Installation"
    To install the package:

    ```shell
    npm install mkdocs-material
    ```

    Or using pip:

    ```shell
    pip install mkdocs-material
    ```

=== "Configuration"
    Add to your `mkdocs.yml`:

    ```yaml
    theme:
      name: material
      features:
        - content.tabs
    ```

=== "Usage"
    Use tabs in your markdown:

    ```markdown
    === "Tab 1"
        Content here

    === "Tab 2"
        More content
    ```

## Single Tab (Still Valid)

=== "Only Option"
    Sometimes you only need one tab for consistency.

    This is perfectly valid syntax.
