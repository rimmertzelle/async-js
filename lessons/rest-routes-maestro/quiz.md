# Quiz — REST Routes in an Existing Backend

*Use these questions to check your own understanding. There are no grades — just honest self-reflection.*

---

## Q1 — Verb vs. URL

**Type:** Recall
**Primarily for:** Lars

**Question:**
A developer writes this route: `GET /api/cars/delete/1`. What is wrong with this URL, and how would you fix it?

**Self-check:**
The problem is that `delete` is an action, not part of the resource name. In REST, the URL identifies the resource (`/api/cars/1`) and the HTTP verb names the action. The correct route is `DELETE /api/cars/1`. If you thought "`/delete` in the path is fine," revisit section 3.1 of the lesson.

---

## Q2 — Reading a Response Envelope

**Type:** Application
**Primarily for:** Fatima

**Question:**
You call `GET /api/makes/4` and get this response:

```json
{
  "meta":  { "resource": "makes" },
  "links": { "self": "/api/makes/4", "collection": "/api/makes" },
  "data":  { "id": 4, "name": "Chevrolet", "country": "USA", "description": "..." }
}
```

A junior teammate says: *"The `links` key is pointless — I already know the URL, I just typed it."* How would you respond?

**Self-check:**
The `links` key is for clients that navigate the API programmatically. A client that follows `links.collection` to go back to the list doesn't need to hardcode `/api/makes` anywhere in its code. If the URL changes (e.g., during a versioning migration), the client keeps working without changes. This is HATEOAS — the server drives navigation. A strong answer names this principle and gives a concrete scenario where it matters.

---

## Q3 — Idempotence

**Type:** Conceptual
**Primarily for:** Daan

**Question:**
You call `DELETE /api/cars/7` three times in a row. The first call returns 200, the second and third return 404. Is this API behaving correctly? Explain using the concept of idempotence.

**Self-check:**
Yes, this is correct. Idempotence means the *server state* after N calls is the same as after one call — car #7 is gone in all cases. The HTTP *response code* is allowed to differ (200 the first time, 404 thereafter), because the resource no longer exists to confirm. Contrast with POST: calling `POST /api/cars` three times would create three cars, so each call has a different effect. If you said "it's broken because the status code changed," revisit section 3.4.

---

## Q4 — Design Judgement

**Type:** Transfer
**For:** All

**Question:**
You're designing a REST API for a library. You need an endpoint that lets clients find all books written by a specific author. A colleague suggests:

- Option A: `GET /api/books/by-author/tolstoy`
- Option B: `GET /api/books?author=tolstoy`

Which would you choose, and why? Is either option "wrong"?

**Self-check:**
There is no single right answer, but a strong response engages with the trade-off:
- Option B is the more conventional REST approach: `/api/books` is the resource, and the query string filters it. The URL stays clean and the verb + URL combination is unambiguous.
- Option A reads like an action or a view ("books-by-author"), which adds a path segment that isn't a resource. It also makes it harder to add other filters later.
- Both options are technically supported and used in real APIs. The key insight is that REST guidelines prefer the resource URL to remain stable and use query parameters for filtering — not path segments that encode the query logic.
Connecting this to the `/api/cars/delete/1` example from Q1 strengthens the answer.
