# Answers — Async JS Pages

*Teacher-facing document. Not for distribution to students.*

---

## Step 2 — Car list: model solution

```twig
{% extends "partials/base.html.twig" %}

{% block content %}
<h1>Cars (async)</h1>
<p id="status">Loading…</p>
<ul id="car-list"></ul>

<script>
    async function loadCars() {
        const status = document.getElementById('status');
        const list = document.getElementById('car-list');

        try {
            const response = await fetch('/api/cars');
            const envelope = await response.json();

            envelope.data.forEach(car => {
                const li = document.createElement('li');
                li.textContent = `${car.model} (${car.year})`;
                list.appendChild(li);
            });

            status.style.display = 'none';
        } catch (error) {
            status.textContent = 'Failed to load cars: ' + error.message;
        }
    }

    loadCars();
</script>
{% endblock %}
```

### Answers to in-exercise questions

**What does `envelope.data` contain?**
An array of car objects. Each object has `id`, `model`, `year`, `color`, `engine`, `description`, `make`, and `categories`. Students can verify this in the Network tab by inspecting the response to `GET /api/cars`.

**If you forget the second `await` before `.json()` — what do you see?**
`[object Promise]` (or nothing, if they try to iterate). `.json()` is itself asynchronous and returns a Promise. Without `await`, `envelope` is a Promise object rather than the parsed data. This is one of the most common mistakes — use it as a teachable moment when it comes up.

**What should the `catch` block do?**
At minimum, show a human-readable error message in the DOM — not just `console.error`. The user should know something went wrong. A strong solution hides the spinner and displays the error in `#status`.

---

## Step 3 — Single car: model solution

```twig
{% extends "partials/base.html.twig" %}

{% block content %}
<div id="car-id" data-id="{{ id }}"></div>
<p id="status">Loading…</p>
<div id="car-detail"></div>

<script>
    async function loadCar() {
        const id = document.getElementById('car-id').dataset.id;
        const status = document.getElementById('status');
        const detail = document.getElementById('car-detail');

        try {
            const response = await fetch('/api/cars/' + id);
            const envelope = await response.json();

            if (envelope.error) {
                status.textContent = 'Failed to load car: ' + envelope.error.message;
                return;
            }

            const car = envelope.data;
            detail.innerHTML = `
                <h2>${car.model} (${car.year})</h2>
                <p><strong>Make:</strong> ${car.make ? car.make.name : 'Unknown'}</p>
                <p><strong>Color:</strong> ${car.color || '—'}</p>
                <p><strong>Engine:</strong> ${car.engine || '—'}</p>
            `;
            status.style.display = 'none';
        } catch (error) {
            status.textContent = 'Failed to load car: ' + error.message;
        }
    }

    loadCar();
</script>
{% endblock %}
```

### Answers to in-exercise questions

**How does the JavaScript know which car ID to fetch?**
The flow is: PHP (`AsyncController::show()`) receives the ID from the URL → passes it to Twig as `['id' => $id]` → Twig embeds it as `data-id="{{ id }}"` on a hidden `<div>` → JavaScript reads it back with `document.getElementById('car-id').dataset.id`. The ID travels from the URL into the page without any extra round-trip.

**How do you detect the error envelope?**
Check for the presence of `envelope.error`. The API returns `{ error: { status, message } }` instead of `{ data: ... }` when a resource is not found. `fetch()` itself does **not** reject on a 404 — the Promise resolves with a response that has `ok: false`. Because the API always returns valid JSON (even on errors), parsing succeeds. Students must inspect `envelope.error` to detect the failure.

**What is different about `envelope.data` here vs. the list page?**
On the list page, `envelope.data` is an **array** of car objects. On the single car page, `envelope.data` is a single **object**. Students need to use `envelope.data` directly — no `.forEach()` needed.

### Grading note

- **Weak:** fetches the data but renders it as raw JSON (`JSON.stringify`), or does not handle the error envelope at all
- **Adequate:** both pages render the data correctly; try/catch present; error message shown in the DOM
- **Strong:** checks `envelope.error` explicitly before accessing `data`; hides the spinner correctly; `car.make` null-checked; extension implemented

---

## Extension answers

**"Back to list" using `envelope.links.collection`:**
```js
const backLink = document.createElement('a');
backLink.href = envelope.links.collection;
backLink.textContent = '← Back to list';
detail.appendChild(backLink);
```
This demonstrates HATEOAS in practice — the client follows a link from the response rather than hardcoding `/async/cars`.

**`Promise.all` for simultaneous fetches:**
```js
const [carsResponse, firstCarResponse] = await Promise.all([
    fetch('/api/cars'),
    fetch('/api/cars/1'),
]);
```
Both requests fire at the same time. In the Network tab, the requests overlap — vs. sequential `await` where the second request only starts after the first completes.
