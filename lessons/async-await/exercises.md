# In-class Assignment — Async JS Pages

*Individual | ~40 min | Formative*

In this assignment you add two new pages to the classic-cars application that load their data asynchronously — without a full page reload. Instead of the server rendering the cars into HTML, the browser receives a minimal HTML shell and your JavaScript fetches the data and builds the DOM itself.

The backend (API routes) already exists and is unchanged. You are only adding three things:

1. A thin PHP controller that serves the shell pages
2. Two Twig templates — mostly HTML, but with a `<script>` block you write yourself
3. Two routes and a service registration

The PHP parts in steps 1 and 3 are done together with the teacher. **The JavaScript in step 2 is yours to write.**

---

## Step 1 — The PHP shell controller *(together with teacher)*

Create `app/Controllers/AsyncController.php`:

```php
<?php

namespace App\Controllers;

use Framework\Request;
use Framework\Response;
use Framework\ResponseFactory;

class AsyncController
{
    public function __construct(private ResponseFactory $responseFactory) {}

    public function index(): Response
    {
        return $this->responseFactory->view('async/index.html.twig');
    }

    public function show(Request $request): Response
    {
        $id = (int) $request->get('id');
        return $this->responseFactory->view('async/show.html.twig', ['id' => $id]);
    }
}
```

Register it in `app/ServiceProvider.php` (follow the same pattern as the other controllers) and add two routes in `app/RouteProvider.php`:

```php
$asyncController = $container->get(AsyncController::class);
$router->addRoute('GET', '/async/cars', [$asyncController, 'index']);
$router->addRoute('GET', '/async/cars/(?<id>\d+)', [$asyncController, 'show']);
```

---

## Step 2 — The car list page *(write the JavaScript yourself)*

Create `app/views/async/index.html.twig`:

```twig
{% extends "partials/base.html.twig" %}

{% block content %}
<h1>Cars (async)</h1>
<p id="status">Loading…</p>
<ul id="car-list"></ul>

<script>
    async function loadCars() {
        // YOUR CODE HERE
        // 1. fetch('/api/cars') and await the response
        // 2. await response.json() to parse the envelope
        // 3. loop over envelope.data and add an <li> for each car
        //    showing the car's model and year
        // 4. hide the #status element when done
        // 5. wrap everything in try/catch — on error, show the
        //    error message in #status instead
    }

    loadCars();
</script>
{% endblock %}
```

**Questions to answer while you work:**

- What does `envelope.data` contain? Check in the browser's network tab before writing any JavaScript.
- If you forget the second `await` before `.json()` — what do you see in the list? Why?
- What should happen in the `catch` block — just `console.error`, or something visible to the user?

---

## Step 3 — The single car page *(write the JavaScript yourself)*

Create `app/views/async/show.html.twig`:

```twig
{% extends "partials/base.html.twig" %}

{% block content %}
<div id="car-id" data-id="{{ id }}"></div>
<p id="status">Loading…</p>
<div id="car-detail"></div>

<script>
    async function loadCar() {
        const id = document.getElementById('car-id').dataset.id;

        // YOUR CODE HERE
        // 1. fetch('/api/cars/' + id) and await the response
        // 2. await response.json() to get the envelope
        // 3. check: does the envelope have an 'error' key?
        //    if yes, show the error message in #status
        //    if no, build an HTML card in #car-detail showing:
        //    model, year, color, engine, make name
        // 4. hide #status when done
    }

    loadCar();
</script>
{% endblock %}
```

**Questions to answer while you work:**

- How does the JavaScript know which car ID to fetch? Trace it: PHP → Twig → HTML attribute → `dataset.id`.
- The API returns an error envelope for unknown IDs (e.g. `/api/cars/9999`). How do you detect this in JavaScript — and what should you show the user?
- What is different about `envelope.data` here vs. the list page?

---

## Step 4 — Extension *(if you finish early)*

Pick one or more:

- Add a "Back to list" link in the detail view that uses `envelope.links.collection` from the API response — not a hardcoded URL.
- Add a "View" link in each list item that navigates to `/async/cars/{id}`. Where does the ID come from?
- What happens if you call `loadCars()` and `loadCar()` simultaneously without `await`? Try it with `Promise.all` and observe the difference in the network tab.
