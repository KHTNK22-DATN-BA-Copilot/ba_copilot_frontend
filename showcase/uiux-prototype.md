<!--HTML_START-->
            <!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link rel='stylesheet' href='styles.css'>
    <title>TicketBox Prototype</title>
</head>
<body>
    <header>
        <h1>TicketBox Event Ticketing</h1>
        <nav>
            <ul>
                <li><a href='#'>Home</a></li>
                <li><a href='#'>Events</a></li>
                <li><a href='#'>My Tickets</a></li>
                <li><a href='#'>Support</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class='hero'>
            <h2>Find Your Next Event</h2>
            <input type='text' placeholder='Search for events...' class='search-input'>
        </section>
        <section class='events'>
            <h2>Upcoming Events</h2>
            <div class='event-card'>
                <h3>Concert XYZ</h3>
                <p>Date: 2023-12-01</p>
                <button class='buy-tickets'>Buy Tickets</button>
            </div>
            <div class='event-card'>
                <h3>Festival ABC</h3>
                <p>Date: 2023-12-15</p>
                <button class='buy-tickets'>Buy Tickets</button>
            </div>
        </section>
        <footer>
            <p>&copy; 2023 TicketBox. All rights reserved.</p>
        </footer>
    </main>
</body>
</html>
            <!--HTML_END-->

            <!--CSS_START-->
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
header { background-color: #2c3e50; color: #ecf0f1; padding: 1rem; }
nav ul { list-style: none; padding: 0; display: flex; }
nav ul li { margin-right: 20px; }
nav ul li a { color: #ecf0f1; text-decoration: none; }
.hero { text-align: center; padding: 2rem; background-color: #3498db; color: white; }
.search-input { padding: 0.5rem; width: 300px; margin-top: 1rem; }
.events { padding: 2rem; }
.event-card { border: 1px solid #bdc3c7; padding: 1rem; margin-bottom: 1rem; border-radius: 5px; transition: transform 0.2s; }
.event-card:hover { transform: scale(1.02); }
.buy-tickets { background-color: #27ae60; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer; border-radius: 5px; }
.buy-tickets:hover { background-color: #219653; }
footer { text-align: center; padding: 1rem; background-color: #34495e; color: white; }
@media (max-width: 768px) {
    nav ul { flex-direction: column; }
    nav ul li { margin-bottom: 10px; }
    .search-input { width: 100%; }
}
            <!--CSS_END-->