# Exercises — Async JavaScript: Promises

**Format:** Individual coding tasks
**Grading:** Formative — not graded. Use these to find out what you understand and what you don't.
**Tools:** VS Code + browser (open an HTML file with a `<script>` tag, or use the browser DevTools console)
**API:** `https://articles-zxjs.onrender.com` — no API key needed

**Available endpoints:**

| Endpoint | Description |
| --- | --- |
| `GET /articles` | Returns a list of article URLs |
| `GET /articles/:id` | Returns a single article's details (id 1–10) |
| `GET /tags` | Returns a list of tag URLs |
| `GET /tags/:id` | Returns a single tag |

**Example response for `/articles/1`:**

```json
{
  "meta": { "title": "The Rise of Electric Vehicles", "url": "/articles/1" },
  "data": {
    "id": 1,
    "title": "The Rise of Electric Vehicles",
    "author": "Jane Doe",
    "date": "2025-04-01",
    "intro": "Electric vehicles are transforming the automotive industry..."
  }
}
```

---

## During the Lesson

### Exercise 1 — Your First Article

**Goal:** Fetch article 1 and log its title and author to the console.

Use this starter code. Fill in the blanks (`/* ... */`) to complete the Promise chain.

```javascript
const url = "https://articles-zxjs.onrender.com/articles/1";

fetch(url)
  .then(/* parse the response as JSON */)
  .then(/* extract title and author from data.data and log them */)
  .catch(/* log a clear error message */);
```

Expected output:

```text
The Rise of Electric Vehicles by Jane Doe
```

**Targets:** Consuming a Promise, `.then`, `.catch`

---

### Exercise 2 — Chain It

**Goal:** Fetch the article list first, then use the result to fetch the first article's details — two requests in sequence.

Requirements:

- Start by fetching `https://articles-zxjs.onrender.com/articles`
- The response contains `data.data` — an array of URL strings like `"/articles/1"`
- Use the first URL in that array to build a second fetch request
- Use **at least three `.then()` calls**: one to parse the list, one to fetch the article, one to parse and log it
- Your output should look like: `First article: The Rise of Electric Vehicles by Jane Doe`
- Add a `.catch()` that logs: `Could not load article: <error message>`

**Tip:** The base URL is `https://articles-zxjs.onrender.com`. Prepend it to the article URL from the list.

**Targets:** Promise chaining, sequential async operations, passing data between `.then` steps

---

### Exercise 3 — Pick Your Article

**Goal:** Adapt the pattern to an article ID of your own choice.

1. Choose any article ID between 1 and 10
2. Fetch that article's details
3. Log a formatted message: `Article <id>: <title> — <intro (first 60 characters)>...`
4. Add a `.finally()` that always logs: `Request complete.`

**Targets:** Applying the pattern to a new input, string manipulation, `.finally`

---

## After the Lesson

### Exercise 4 — Multiple Articles at Once

**Goal:** Fetch three articles at the same time using `Promise.all()`.

Requirements:

- Fetch articles 1, 5, and 10 in parallel — do not chain them sequentially
- Use `Promise.all()` to wait for all three before logging anything
- Log all three titles in one message: `Articles: [title1] | [title2] | [title3]`
- Add a `.catch()` — what happens if one of the three requests fails?

**Tip:** `Promise.all()` takes an array of Promises:

```javascript
Promise.all([promise1, promise2, promise3])
  .then(([result1, result2, result3]) => { /* all results available here */ });
```

**Targets:** Parallel async operations, `Promise.all`, error handling with multiple Promises

---

### Exercise 5 — Handle the Storm

**Goal:** Practice error handling by deliberately breaking things.

Start with working code from Exercise 1. Then make the following changes one at a time, and observe what happens:

1. Change the URL to fetch **article 999** (e.g., `/articles/999`). Does `.catch()` fire? Why or why not?
2. Change the URL to a **completely wrong domain** (e.g., `https://not-a-real-api.xyz`). What error do you get?
3. In your first `.then()`, deliberately **throw an error**: `throw new Error("Oops!")`. Where does `.catch()` pick this up?
4. Add a `.finally()` that always logs `"Done."` — confirm it runs in all three cases above.

For each case, write a short comment in your code explaining what you observed.

**Targets:** `.catch` placement, thrown errors in chains, `.finally`, the difference between HTTP errors and network errors

---

### Exercise 6 — Promises vs. Callbacks

**Goal:** Understand the tradeoff by experiencing it directly.

1. Take your solution from Exercise 2 (fetch article list → fetch first article → log title and author).
2. Rewrite it using **only callbacks** — no `.then()`, no `.catch()`. Use `XMLHttpRequest` and nest the logic manually.
3. In a comment block at the bottom of your file, answer this question in 3–5 sentences:

> *"Which version would you choose for a real project — and why? Are there situations where the other version might still be the better choice?"*

**Targets:** Transfer, argumentation, understanding the motivation behind Promises

---

*Stuck? Start by logging the full response to the console and exploring its structure. Every response has a `meta` and a `data` field — look there first.*
