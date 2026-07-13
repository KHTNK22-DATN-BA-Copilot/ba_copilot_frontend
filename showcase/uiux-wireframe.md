<!--HTML_START-->
            <!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>TicketBox UI Wireframe</title>
</head>
<body>
    <header>
        <h1>TicketBox Event Ticketing System</h1>
        <nav>
            <ul>
                <li><a href='#'>Home</a></li>
                <li><a href='#'>Events</a></li>
                <li><a href='#'>About Us</a></li>
                <li><a href='#'>Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class='hero'>
            <h2>Get Your Tickets Now!</h2>
            <p>Experience the best events with our ticketing system.</p>
        </section>
        <section class='events'>
            <h2>Upcoming Events</h2>
            <div class='event-card'>
                <h3>Concert Title</h3>
                <p>Date: 2023-12-01</p>
                <p>Location: Stadium</p>
                <button>Buy Tickets</button>
            </div>
            <div class='event-card'>
                <h3>Concert Title</h3>
                <p>Date: 2023-12-02</p>
                <p>Location: Stadium</p>
                <button>Buy Tickets</button>
            </div>
        </section>
        <section class='ticket-form'>
            <h2>Purchase Your Tickets</h2>
            <form>
                <label for='event'>Select Event:</label>
                <select id='event'>
                    <option value='concert1'>Concert 1</option>
                    <option value='concert2'>Concert 2</option>
                </select>
                <label for='quantity'>Quantity:</label>
                <input type='number' id='quantity' name='quantity' min='1' max='10'>
                <button type='submit'>Submit</button>
            </form>
        </section>
    </main>
    <footer>
        <p>&copy; 2023 TicketBox</p>
    </footer>
</body>
</html>
            <!--HTML_END-->

            <!--CSS_START-->
            body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}
header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
}
nav ul {
    list-style-type: none;
    padding: 0;
}
nav ul li {
    display: inline;
    margin-right: 15px;
}
nav ul li a {
    color: #fff;
    text-decoration: none;
}
.hero {
    background-color: #f4f4f4;
    padding: 2rem;
    text-align: center;
}
.events {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1rem;
}
.event-card {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: center;
}
.ticket-form {
    padding: 1rem;
}
.ticket-form form {
    display: flex;
    flex-direction: column;
}
.ticket-form label {
    margin: 0.5rem 0;
}
@media (max-width: 600px) {
    nav ul li {
        display: block;
        margin: 0.5rem 0;
    }
}
            <!--CSS_END-->