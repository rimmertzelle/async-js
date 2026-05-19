# Lesson: REST Routes in an Existing Backend

**Target audience:** 2nd-year bachelor Software Engineering students (HBO-ICT)
**Duration:** 90 minutes
**Prerequisites:** Basic PHP / MVC familiarity; students have seen HTTP and have cloned the classic-cars project

**Learning objectives (as questions):**

- Why do API routes look different from HTML routes for the same data?
- How does an HTTP verb tell a server what to do — and why does it matter?
- What makes a response "RESTful", and what is the envelope (meta / links / data) doing there?
- What is idempotence, and which HTTP methods have it?
- How do I add a new REST resource to the Maestro backend by following an existing pattern?

---

## 1. Opening — Challenging Problem or Question

**Time:** ~10 min

Present this without explanation first — let students sit with it.

> You open an API you've never seen before and you make these two requests:
>
> ```
> DELETE /api/cars/7
> DELETE /api/cars/7
> ```
>
> You send the exact same request twice. The first call succeeds. The second returns 404.
> **Is this API broken?**

Ask for a show of hands or a quick Mentimeter poll: broken / not broken / depends.

Then follow up: *"What if I replaced DELETE with POST — does your answer change?"*

Let the disagreement surface. Don't resolve it yet. Explain that by the end of the lesson they will be able to answer this definitively — and they will have added two new resources to a real backend.

<!-- Persona note:
- Fatima will likely say "not broken — 404 on the second call makes sense" from practical intuition. Use that as an anchor for the group.
- Lars needs the scenario grounded: connect DELETE to "pressing a button that removes something". Let his classmates' answers do the early lifting.
- Daan will want to poke further: "what if the same URL represents something new after deletion?" — acknowledge the question, park it for the HATEOAS section.
-->

---

## 2. Prior Knowledge Check

**Time:** ~8 min

Use a Mentimeter word cloud or ask pairs to discuss and report back:

> "If a client sends `GET /api/cars/1`, what do you expect back? What about `POST /api/cars`? And `DELETE /api/cars/1`?"

Then reveal the following statement and ask: **true or false, and why?**

> *"A REST API should use `/api/cars/delete/1` to delete a car."*

This surfaces the two most common misconceptions:
1. Verbs belong in the URL ("but how else does the server know what to do?")
2. POST and PUT are interchangeable ("they both send data, right?")

Write the misconceptions on the board explicitly so the class can revisit them later.

<!-- Persona note:
- Lars may have seen REST in a tutorial but never built anything — he may default to "sounds right" for the false statement. Reframe: "what is the URL for?"
- Fatima may know the right answer from experience but not the *why* — push her to articulate it.
- Daan will probably get it right but may conflate PATCH with PUT. Surface that too.
-->

---

## 3. Core Concepts

**Time:** ~20 min

### 3.1 — URL identifies the resource; verb identifies the action

The URL `/api/cars/1` is the name of a thing, not a command. The HTTP method is the command.

| Verb     | URL           | Intent                  |
| -------- | ------------- | ----------------------- |
| `GET`    | `/api/cars`   | Give me all cars        |
| `POST`   | `/api/cars`   | Create a new car        |
| `GET`    | `/api/cars/1` | Give me car #1          |
| `PUT`    | `/api/cars/1` | Replace car #1 entirely |
| `DELETE` | `/api/cars/1` | Remove car #1           |

Show the contrast: HTML forms can only do GET and POST, so HTML routes need `/edit` and `/delete` segments to distinguish them. API clients can use any verb — so extra path segments are redundant.

**Go to `app/RouteProvider.php`** and show the two patterns side by side. Ask: *"Why does the HTML side have `/cars/1/edit` but the API side does not?"*

<!-- Persona note: show the file in the editor, not on a slide — Fatima and Daan will get it immediately; Lars benefits from seeing actual code before the abstract principle. -->

### 3.2 — The JSON envelope: meta / links / data

Open `ApiBaseController.php` and trace `apiJson()` as a group.

Every response has the same three-key shape regardless of which resource is returned:

| Key     | Purpose                                                 |
| ------- | ------------------------------------------------------- |
| `meta`  | Resource name, total count for collections              |
| `links` | HATEOAS: where the client can go next, without hardcoding URLs |
| `data`  | The actual payload                                      |

Ask: *"Why is the `links` key useful? What problem does it solve?"*

Lead towards: a client that follows links from the response doesn't need to hardcode `/api/cars` anywhere. This is HATEOAS (Hypermedia As The Engine Of Application State) — the server drives navigation.

**Conceptual extension:** If the server renames `/api/cars` to `/api/v2/cars`, a client that follows links from responses breaks nowhere. A client that hardcodes the URL breaks everywhere.

### 3.3 — Content negotiation

The same `CarRepository` feeds both `/cars` (HTML) and `/api/cars` (JSON). The controller decides the representation.

Show `CarController::index()` and `ApiController::cars()` side by side:

```
/cars      → CarController::index()  → Twig template → HTML
/api/cars  → ApiController::cars()   → apiJson()     → JSON
```

Ask: *"Is there anything wrong with `/api/cars` returning HTML if the client asks for it with an Accept header?"*

Explain: proper content negotiation reads the `Accept: application/json` request header and responds accordingly. Maestro routes by URL prefix for simplicity — pragmatic, but not strictly correct. Knowing the distinction matters in real API design.

### 3.4 — Idempotence

Return to the opening question. Define:

> **Idempotent** — sending the same request N times produces the same server state as sending it once.

| Method   | Idempotent? | Why                                                                    |
| -------- | ----------- | ---------------------------------------------------------------------- |
| `GET`    | Yes         | Read-only; no state change                                             |
| `PUT`    | Yes         | Replaces to a known state; repeating is safe                           |
| `DELETE` | Yes         | Already gone after the first call; the *effect* is the same even if the server returns 404 |
| `POST`   | No          | Creates a new resource each time                                       |

Resolve the opening question: the API is **not broken**. The effect of both DELETE calls is identical — the car is gone. A 404 on the second call is honest, not a failure.

<!-- Persona note:
- For Lars: use the analogy of a light switch — pressing "off" twice has the same end state as pressing it once.
- Fatima will connect this to real scenarios quickly; invite her to name one from experience (e.g., submitting a form twice).
- This also resolves Daan's earlier edge-case question naturally.
-->

---

## 4. Application

**Time:** ~40 min

Students implement Makes API routes in the classic-cars backend, following the exact pattern already in place for Cars.

**Task (stated as a question):**

> *"The Makes resource exists in the database and has a repository — but it has no API routes yet. How do you expose it as a REST resource, following the same pattern as Cars?"*

**Minimal path (low floor — accessible to Lars):**
1. Add `makes()` and `make()` methods to `ApiController.php` by adapting the `cars()` / `car()` pattern
2. Register the two GET routes in `RouteProvider.php`
3. Test: open `GET /api/makes` and `GET /api/makes/1` in the browser

**Extension challenges (high ceiling — for Daan and fast finishers):**
- Nest `cars` inside the single-make response (`GET /api/makes/1` returns the make with its cars array)
- Implement the full HTML CRUD for Makes (8 routes + views, following `CarController`)
- Add Categories with the same pattern end-to-end

**Teacher note:** Watch for two common sticking points:
1. Forgetting to register the controller in `ServiceProvider.php` → DI error → use as a teachable moment about dependency injection
2. Adding `/delete` to the API route → redirect back to the route table from section 3.1 and ask: "does the verb already say what needs to happen?"

<!-- Persona note:
- If Lars is stuck, point him at the checklist in the README as a scaffold. Consider pairing him with a more experienced student.
- Fatima will move quickly through the mechanical parts — push her to the nested-cars extension and ask her to decide: what HTTP status should `/api/makes/999` return, and why?
- Daan may invent his own pattern — ask him to justify each design choice against the REST constraints from the lesson before accepting it.
-->

---

## 5. Reflection

**Time:** ~10 min

Pose one question at a time; use think-pair-share or Mentimeter open questions:

1. **"What is the difference between `POST /api/cars` and `PUT /api/cars/1` — in plain language, not code?"**
   *(targets: idempotence + resource design)*

2. **"If you had to explain to a teammate why API routes don't have `/edit` or `/delete` in them, what would you say?"**
   *(targets: URL design principle)*

3. **"What do you understand differently now compared to the start of this lesson?"**
   *(metacognitive; make space for Fatima's experience and Daan's depth; gives Lars a safe closing anchor)*

Optional 2-minute exit ticket (written):

> *"In one sentence: what makes a REST API 'RESTful'?"*

Collect slips or Mentimeter results to inform the next lesson's opening.

---

## Sources Used

- [classic-cars repository](https://github.com/rimmertzelle/classic-cars) — Maestro framework application used as the hands-on context
- [restfulapi.net](https://restfulapi.net) — REST fundamentals reference
- [restfulapi.net/content-negotiation](https://restfulapi.net/content-negotiation/) — content negotiation
- [restfulapi.net/hateoas](https://restfulapi.net/hateoas/) — HATEOAS
- [restfulapi.net/idempotent-rest-apis](https://restfulapi.net/idempotent-rest-apis/) — idempotence
- Ken Bain, *What the Best College Teachers Do* — lesson design principles
- `.claude/context/educational_context.md` and `.claude/context/persona.md` — course context
