const SUPABASE_URL = "https://zerwymznhojeaeyrggnl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_L7sKCa3zTelmLbDdB3XawA_oK8V5pKb";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

async function loadServices() {

    const { data, error } = await supabaseClient
        .from("services")
        .select("id, name, price, duration")
        .order("name");

    if (error) {
        console.error("Error loading services:", error);
        return;
    }

    const serviceSelect =
        document.getElementById("service");

    serviceSelect.innerHTML =
        '<option value="">Choose a service</option>';

    data.forEach(function(service) {

        const option =
            document.createElement("option");

        option.value = service.name;

        option.textContent =
            `${service.name} — ${service.price} SAR`;

        serviceSelect.appendChild(option);
    });
}
// التأكد أن المستخدم مسجل دخول
async function checkLogin() {

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}


// جلب الخدمات
async function loadServices() {

    const { data, error } = await supabaseClient
        .from("services")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error(error);
        return;
    }

    const servicesList =
        document.getElementById("servicesList");

    servicesList.innerHTML = "";

    data.forEach(function(service) {

        const card = document.createElement("div");

        card.className = "service-card";

        card.innerHTML = `
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>
                    ${service.price} SAR ·
                    ${service.duration} minutes
                </p>
            </div>

            <button
                class="delete-btn"
                onclick="deleteService(${service.id})"
            >
                Delete
            </button>
        `;

        servicesList.appendChild(card);
    });
}


// إضافة خدمة جديدة
async function addService() {

    const name =
        document.getElementById("serviceName").value.trim();

    const price =
        document.getElementById("servicePrice").value;

    const duration =
        document.getElementById("serviceDuration").value;


    if (!name || !price || !duration) {

        alert("Please fill in all fields.");

        return;
    }


    const { error } = await supabaseClient
        .from("services")
        .insert({
            name: name,
            price: Number(price),
            duration: Number(duration)
        });


    if (error) {

        console.error(error);

        alert("Something went wrong.");

        return;
    }


    document.getElementById("serviceName").value = "";
    document.getElementById("servicePrice").value = "";
    document.getElementById("serviceDuration").value = "";


    loadServices();
}


// حذف خدمة
async function deleteService(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this service?");

    if (!confirmDelete) {
        return;
    }


    const { error } = await supabaseClient
        .from("services")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert("Unable to delete service.");

        return;
    }


    loadServices();
}


// زر إضافة الخدمة
document
    .getElementById("addServiceBtn")
    .addEventListener("click", addService);


// تشغيل الصفحة
checkLogin().then(function(isLoggedIn) {

    if (isLoggedIn) {
        loadServices();
    }

});


// تسجيل الخروج
document
    .getElementById("logoutBtn")
    .addEventListener("click", async function() {

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });

loadServices();