# Invalid Bundle Exec Usage

This document demonstrates incorrect bundle exec usage that should be flagged.

## No language specified with bundle exec

```
bundle exec rspec
```

## Wrong language with bundle exec

```ruby
bundle exec rspec spec/
```

## Another wrong language

```bash
bundle exec rails server
bundle exec rake db:migrate
```

## Multiple violations

```
bundle exec rspec
```

```ruby
bundle exec rails console
```

## Mixed valid and invalid

Valid:

```shell
bundle exec rspec
```

Invalid:

```
bundle exec rake test
```

## Complex case with other text

```ruby
# This is a Ruby command runner
bundle exec rspec spec/models/
```