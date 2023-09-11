# Notepad

## `rects` or `defs` & `use`s?

```html
<rect width="1" height="1" x="1" y="1" fill="#000000" />
```

Each `rect` declaration is 55 characters long.

```
f(x) = 55x
```

```html
<defs><rect id="p" width="1" height="1" /></defs>
<use href="#p" x="1" y="1" fill="#000000" />
```

`defs` declaration is 48 characters long, and each `use` is 43 characters long.

```
f2(x) = 43x + 48
```

**When do they meet?**

```
55x = 43x + 48

12x = 48

x = 4
```

So when there are more than 4 colored rects, then it makes sense to use `defs`.

That feels like too few to warrant checking before generating the export: we can reasonably use `defs` for all cases.

## CSS variables for `fill`

I had the idea to use CSS variables to replace repetitive fill hexcodes, but I think the idea is a non-starter:

- `fill="#000000"` is 14 characters long
- `fill="var(--a)"` is 15 characters long, let alone the `style` declaration required

So I'm going to drop the idea for now.
