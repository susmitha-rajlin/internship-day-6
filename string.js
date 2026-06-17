// ================= DARK MODE =================

function changeMode() {
    document.body.classList.toggle("dark");
}

// ================= MENU =================

function toggleMenu() {
    document.getElementById("menu").classList.toggle("show");
}

// ================= CLOCK =================

function showTime() {
    const now = new Date();

    const clock = document.getElementById("clock");

    if (clock) {
        clock.innerText = now.toLocaleTimeString();
    }
}

setInterval(showTime, 1000);
showTime();



// ================= TOP BUTTON =================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (!topBtn) return;

    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});

if (topBtn) {

    topBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// ================= TODO LIST =================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    if (!taskList) return;

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span style="${task.completed ? 'text-decoration:line-through' : ''}">
                ${task.text}
            </span>
            <button class="deleteBtn">Delete</button>
        `;

        const checkbox = li.querySelector("input");
        const deleteBtn = li.querySelector(".deleteBtn");

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });

        deleteBtn.addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();

        });

        taskList.appendChild(li);

    });

    if (taskCount) {
        taskCount.innerText =
            "Total Tasks: " + tasks.length;
    }
}

function addTask() {

    if (!taskInput) return;

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();

    renderTasks();
}

if (addBtn) {
    addBtn.addEventListener("click", addTask);
}

if (taskInput) {

    taskInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            addTask();
        }

    });

}

renderTasks();

// ================= WEATHER APP =================

const weatherBtn = document.getElementById("getWeatherBtn");

if (weatherBtn) {

    weatherBtn.addEventListener("click", async () => {

        const city =
            document.getElementById("cityInput").value.trim();

        if (city === "") {

            alert("Enter city name");

            return;
        }

        const loading =
            document.getElementById("loading");

        const weatherResult =
            document.getElementById("weatherResult");

        loading.style.display = "block";
        weatherResult.style.display = "none";

        try {

            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );

            const geoData = await geoResponse.json();

            if (!geoData.results) {

                throw new Error("City not found");

            }

            const latitude =
                geoData.results[0].latitude;

            const longitude =
                geoData.results[0].longitude;

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
            );

            const weatherData =
                await weatherResponse.json();

            const current =
                weatherData.current;

            document.getElementById("cityName")
                .innerText = city;

            document.getElementById("temp")
                .innerText =
                "Temperature: " +
                current.temperature_2m +
                "°C";

            document.getElementById("humidity")
                .innerText =
                "Humidity: " +
                current.relative_humidity_2m +
                "%";

            document.getElementById("description")
                .innerText =
                "Weather Code: " +
                current.weather_code;

            weatherResult.style.display = "block";

        } catch (error) {

            alert("City not found");

        }

        loading.style.display = "none";

    });

}

// ================= EMAILJS =================

window.addEventListener("load", () => {

    if (typeof emailjs !== "undefined") {

        emailjs.init("Ul4bruxAKiSnsp2Xv");

        const form =
            document.getElementById("contactForm");

        const btn =
            document.getElementById("submitBtn");

        if (form) {

            form.addEventListener("submit", (e) => {

                e.preventDefault();

                btn.disabled = true;

                btn.innerText = "Sending...";

                emailjs.send(
                    "service_lge29iu",
                    "template_1e8zjpf",
                    {
                        from_name:
                            document.getElementById("name").value,

                        from_email:
                            document.getElementById("email").value,

                        message:
                            document.getElementById("message").value
                    }
                )
                .then(() => {

                    alert("Message Sent Successfully");

                    form.reset();

                })
                .catch(() => {

                    alert("Failed to send email");

                })
                .finally(() => {

                    btn.disabled = false;

                    btn.innerText =
                        "Send Message";

                });

            });

        }

    }

});

// ================= AI CHATBOT =================

const GROQ_API_KEY = "your-key-here";



async function getAIResponse(message) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
                { role: "user", content: message }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}
sendBtn.addEventListener("click", async () => {
    const msg = chatInput.value;
    if (!msg) return;

    addMessage(msg, "user");
    chatInput.value = "";

    addMessage("Thinking...", "bot");

    try {
        const reply = await getAIResponse(msg);

        chatMessages.lastChild.remove(); // remove "Thinking..."
        addMessage(reply, "bot");

    } catch (error) {
        chatMessages.lastChild.remove();
        addMessage("Error connecting AI ❌", "bot");
    }
});