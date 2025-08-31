# Valid Bundle Exec Usage

This document demonstrates correct bundle exec usage.

## Correct Usage with shell

```shell
bundle exec rspec
```

## Multiple commands with shell

```shell
bundle exec rails server
bundle exec rake db:migrate
```

## Bundle exec with shell and additional context

```shell
cd /app
bundle exec rspec spec/
```

## Non-bundle exec commands with other languages

```ruby
puts "Hello World"
```

```shell
echo "This is fine because it doesn't use bundle exec"
```

## Commands without bundle exec

```shell
echo "This is fine"
```
